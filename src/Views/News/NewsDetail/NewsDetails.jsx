import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../../components/Header/Header'
import SideMenu from '../../components/SideMenu/SideMenu'
import { doc, getDoc } from 'firebase/firestore'
import { db, storage } from '../../../Models/firebase/config'
import DOMPurify from 'dompurify'
import { Tag, message } from 'antd'
import dateFormat from "dateformat";
import { FileExcelOutlined, FileGifOutlined, FileImageOutlined, FileJpgOutlined, FilePdfOutlined, FilePptOutlined, FileTextOutlined, FileUnknownOutlined, FileWordOutlined, FileZipOutlined, FolderOutlined } from '@ant-design/icons'
import { ref } from 'firebase/storage'

export default function NewsDetails() {
    const { newsID } = useParams()
    const [post, setPost] = useState({})
    const navigate = useNavigate()
    useEffect(() => {
        async function getCurrentPost() {
            const docRef = doc(db, "posts", newsID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPost(docSnap.data())
            } else {
                message.error("This post has been deleted!")
                navigate("/news")
            }
        }

        getCurrentPost()
    }, [newsID])

    function iconFile(fileName) {
        let extension = ""
        extension = fileName.split('.').pop();

        switch (extension.toLowerCase()) {
            case "pdf":
                return (<FilePdfOutlined />)

            case "xlsx":
            case "xlsm":
            case "xls":
            case "xml":
                return (<FileExcelOutlined />)

            case "txt":
            case "csv":
            case "rtf":
                return (<FileTextOutlined />)

            case "doc":
            case "docx":
                return (<FileWordOutlined />)

            case "pptx":
            case "pptm":
            case "ppt":
                return (<FilePptOutlined />)

            case "gif":
                return (<FileGifOutlined />)

            case "jpeg":
            case "jpg":
                return (<FileJpgOutlined />)

            case "bmp":
            case "svg":
            case "png":
                return (<FileImageOutlined />)

            case "rar":
            case "zip":
            case "dmg":
            case "iso":
            case "pkg":
            case "tar":
                return (<FileZipOutlined />)

            case "":
                return (<FolderOutlined />)

            default:
                return (<FileUnknownOutlined />)
        }
    }


    return (
        <div className="App-container">
            <Header />
            <div className="App-Content-container">
                <SideMenu />
                <div className="App-Content-Main" style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 20, paddingBottom: 20 }}>
                    <h1 style={{ color: "#B94A48" }} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.title) }}></h1>
                    {post.timestamp && <p style={{ color: "#666", fontSize: 13 }}>{dateFormat(post.timestamp.toDate(), "dddd, mmmm dS, yyyy - h:MM TT")}</p>}
                    <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}></p>
                    {
                        post.file ?
                            <Tag style={{ marginTop: 10, fontSize: 15, padding: 10 }} icon={iconFile(ref(storage, post.file).name)} color="blue">
                                <a
                                    target="_blank"
                                    href={post.file}
                                    rel="noreferrer"
                                >
                                    {ref(storage, post.file).name}
                                </a>
                            </Tag>
                            : ""
                    }
                </div>
            </div>
        </div>
    )
}
