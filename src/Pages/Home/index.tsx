import React, { Component } from 'react'
import { Button } from 'antd'
import axios from 'axios'
import './style.css'
import { Redirect } from 'react-router-dom'


class Home extends Component {
    state = {
        loaded: false,
        isLogin: true
    }
    componentDidMount() {
        axios.get('/api/isLogin')
            .then(res => {
                if (!res.data?.data) {
                    this.setState({
                        loaded: true,
                        isLogin: false
                    })
                }
            })
    }
    render() {
        const { isLogin, loaded } = this.state

        if (isLogin) {
            if (loaded) {
                return (
                    <div className="home-page">
                        <Button type="primary">爬取</Button>
                        <Button type="primary">展示</Button>
                        <Button type="primary">退出</Button>
                    </div>
                )
            } else {
                return null
            }

        }

        return <Redirect to="/login" />

    }

}

export default Home