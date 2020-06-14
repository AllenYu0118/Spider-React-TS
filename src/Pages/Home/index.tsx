import React, { Component } from 'react'
import { Button, message } from 'antd'
import moment from 'moment'
import ReactEcharts from 'echarts-for-react'
import request from '../../request'
import './style.css'
import { Redirect } from 'react-router-dom'

interface CourseItem {
    title: string,
    count: number
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
        request.get('/api/isLogin')
            .then(res => {
                const data: responseResult.isLogin = res.data
                if (!data) {
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

        this.handleShowDataClick()

    }

    handleShowDataClick = () => {
        request.get('/api/showData')
            .then(res => {
                const data: responseResult.showData = res.data
                if (data) {
                    this.setState({
                        data
                    })
                } else {
                    message.error('数据获取失败！')
                }
            })
    }

    handleCrowllerClick = () => {
        request.get('/api/getData')
            .then(res => {
                const data: responseResult.getData = res.data
                if (data) {
                    message.success('爬取成功')

                    this.handleShowDataClick()
                } else {
                    message.error('爬取成功')
                }
            })
    }

    handleLogoutClick = () => {
        request.get('/api/logout')
            .then(res => {
                const data: responseResult.loginout = res.data
                if (data) {
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

        const result: echarts.EChartOption.Series[] = []

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
                            <Button type="primary" onClick={this.handleShowDataClick}>展示</Button>
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