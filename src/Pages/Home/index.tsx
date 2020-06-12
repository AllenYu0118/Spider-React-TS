import React, { Component } from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import ReactEcharts from 'echarts-for-react'
import axios from 'axios'
import './style.css'
import { Redirect } from 'react-router-dom'

interface CourseItem {
    title: string,
    count: number
}

interface LineData {
    name: string
    type: string
    data: number[]
}
interface State {
    loaded: boolean
    isLogin: boolean
    data: {
        [key: string]: CourseItem[]
    }
}

class Home extends Component {
    state: State = {
        loaded: false,
        isLogin: true,
        data: {}
    }
    componentDidMount() {
        axios.get('/api/isLogin')
            .then(res => {
                if (!res.data?.data) {
                    this.setState({
                        isLogin: false,
                        loaded: true
                    })
                } else {
                    this.setState({
                        loaded: true
                    })
                }
            })

        axios.get('/api/showData')
            .then(res => {
                if (res.data?.data) {
                    this.setState({
                        data: res.data.data
                    })
                } else {
                    message.error('数据获取失败！')
                }
            })
    }

    handleCrowllerClick = () => {
        axios.get('/api/getData')
            .then(res => {
                if (res.data?.data) {
                    message.success('爬取成功')
                } else {
                    message.error('爬取成功')
                }
            })
    }

    handleLogoutClick = () => {
        axios.get('/api/logout')
            .then(res => {
                if (res.data?.data) {
                    this.setState({
                        isLogin: false
                    })
                } else {
                    message.error('退出失败')
                }
            })
    }

    getOptions: () => echarts.EChartOption = () => {
        const { data } = this.state
        const courseNames: string[] = []
        const times: string[] = []
        const tempData: {
            [key: string]: number[]
        } = {}
        for (let i in data) {
            const item = data[i]
            times.push(moment(Number(i)).format('MM-DD HH:mm'))
            item.forEach(innnerItem => {
                const { title, count } = innnerItem

                if (courseNames.indexOf(title) === -1) {
                    courseNames.push(title)
                }

                tempData[title]
                    ? tempData[title].push(count)
                    : (tempData[title] = [count])
            })
        }

        const result: LineData[] = []

        for (let i in tempData) {
            result.push({
                name: i,
                type: 'line',
                data: tempData[i]
            })
        }

        return {
            title: {
                text: '课程访问量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: times
            },
            yAxis: {
                type: 'value'
            },
            series: result
        }
    }

    render() {
        const { isLogin, loaded } = this.state

        if (isLogin) {
            if (loaded) {
                return (
                    <div className="home-page">
                        <div className="buttons">
                            <Button type="primary" onClick={this.handleCrowllerClick}>爬取</Button>
                            <Button type="primary">展示</Button>
                            <Button type="primary" onClick={this.handleLogoutClick}>退出</Button>
                        </div>


                        <ReactEcharts option={this.getOptions()} />
                    </div>
                )
            }

            return null
        }

        return <Redirect to="/login" />
    }

}

export default Home