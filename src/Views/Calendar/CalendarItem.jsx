import React, { useContext, useEffect } from 'react';
import { Calendar, Typography, Badge, Tooltip, Modal, Form, Input, theme, Select, TimePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import SideMenu from '../components/SideMenu/SideMenu';
import Header from '../components/Header/Header';
import "./CalendarItem.css";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../Models/firebase/config';
import { AuthContext } from '../components/Context/AuthProvider';

export default function CalendarItem() {
  const { user: { uid } } = useContext(AuthContext)
  const [value, setValue] = useState(() => dayjs());
  const [selectedValue, setSelectedValue] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState("");
  const [optionsColleague, setOptionsColleague] = useState([])
  const [colleagueGroup, setColleagueGroup] = useState([])
  const [tasks, setTasks] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const collectionRef = collection(db, "users");
      const snapshots = await getDocs(collectionRef);
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;

        return data;
      });
      setOptionsColleague(docs);
    })();

    (async () => {
      const collectionRef = collection(db, "tasks");
      const snapshots = await getDocs(collectionRef);
      const docs = snapshots.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;

        return data;
      });

      const tasksObject = docs.reduce((acc, doc) => {
        const date = doc.id;
        acc[date] = doc.task;
        return acc;
      }, {});

      setTasks(tasksObject);
    })();
  }, [])

  const filteredTasks = tasks && typeof tasks === 'object'
    ? Object.keys(tasks).reduce((result, date) => {
      const cellTasks = tasks[date];
      cellTasks.forEach((task) => {
        if (
          task.owner.includes(uid) ||
          task.colleagues.some(colleague => colleague === uid)
        ) {
          if (!result[date]) {
            result[date] = [];
          }
          result[date].push({ content: task.content });
        }
      });
      return result;
    }, {})
    : {};

  const wrapperStyle = {
    width: "100%",
    border: `1px solid ${theme.useToken().colorBorderSecondary}`,
    borderRadius: theme.useToken().borderRadiusLG,
    paddingLeft: 50,
    paddingRight: 50,
  };

  const onSelect = (newValue) => {
    const selectedDate = newValue.format('YYYY-MM-DD');
    const isInCurrentMonth = newValue.month() === value.month();

    if (isInCurrentMonth) {
      setSelectedValue(selectedDate);
      setModalVisible(true);
    } else {
      setSelectedValue(null);
    }

    setValue(newValue);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields()
    setSelectedValue(null);
  };

  const handleFormSubmit = async () => {
    const cellTasks = filteredTasks[selectedValue] || [];
    const updatedTasks = [...cellTasks, { content: content, colleagues: colleagueGroup, owner: uid }];

    const docRef = doc(db, "tasks", selectedValue);

    const docSnapshot = await getDoc(docRef);
    const currentTasks = docSnapshot.exists() ? docSnapshot.data().task : [];

    const updatedTaskArray = [...currentTasks, ...updatedTasks];
    await setDoc(docRef, {
      task: updatedTaskArray,
    });

    setTasks(prevTasks => ({
      ...prevTasks,
      [selectedValue]: updatedTaskArray,
    }));

    setContent("");
    setColleagueGroup([]);
    handleModalCancel();
  };

  const dateCellRender2 = (date) => {
    const dateString = date.format('YYYY-MM-DD');
    const cellTasks = filteredTasks[dateString] || [];

    return (
      <div>
        <ul className="events">
          {cellTasks.map((task, index) => (
            <li key={index}>
              <Tooltip title={task.content} color='blue'>
                <Badge status="success" text={task.content} />
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
    );
  };


  function groupBy(xs, f) {
    if (xs)
      return Object.entries(
        xs.reduce(
          (r, v, i, a, k = f(v)) => ((r[k] || (r[k] = [])).push(v), r),
          {}
        )
      ).map(([label, options]) => ({ label, options }));
  }

  const result = groupBy(optionsColleague, (option) => option.role);
  result.forEach((res) => {
    res.options = res.options.map((option) => ({
      label: option.displayName || option.email,
      value: option.uid,
    }));
  });

  const handleChange = (value) => {
    setColleagueGroup((prev) => [...prev, value]);
  };

  const handleDeselect = (value) => {
    const index = colleagueGroup.indexOf(value);
    if (index > -1) {
      const updatedColleagueGroup = [...colleagueGroup];
      updatedColleagueGroup.splice(index, 1);
      setColleagueGroup(updatedColleagueGroup);
    }
  };

  return (
    <div className="App-container">
      <Header />
      <div className="App-Content-container">
        <SideMenu />
        <div className="App-Content-Main">
          <div style={wrapperStyle}>
            <Typography.Title level={3}>Calendar</Typography.Title>
            <Calendar cellRender={dateCellRender2} value={value} onSelect={onSelect} />
            <Modal
              visible={modalVisible}
              title={`${selectedValue && selectedValue.toLocaleString()}`}
              okText="Add"
              onCancel={handleModalCancel}
              onOk={handleFormSubmit}
            >
              <Form form={form}>
                <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} label="Task" name="task" rules={[{ required: true, message: 'Please enter a task!' }]}>
                  <Input placeholder="Enter task" onChange={(e) => setContent(e.target.value)} />
                </Form.Item>
                <Form.Item label="Teammate" name={"teammate"} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
                  <Select
                    mode="multiple"
                    allowClear
                    style={{
                      width: "15vw",
                      overflowX: "visible",
                    }}
                    placeholder="Custom Group"
                    onSelect={handleChange}
                    options={Object(result)}
                    onDeselect={handleDeselect}
                  />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}
