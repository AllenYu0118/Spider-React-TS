import React, { Component } from 'react'
import { Button, message, Table, Tabs} from 'antd'
import dayjs from 'dayjs'
import ReactEcharts from 'echarts-for-react'
import request from '../../request'
import './style.css'
import { Redirect } from 'react-router-dom'

const { TabPane } = Tabs;
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

enum TableKeys {
    Vue,
    React,
    Vue2,
    Webpack,
    Lesson
}

interface TableItem {
    date: string
    vue: number
    react: number
    webpack: number
    lesson: number
}

const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Vue 访问量',
    dataIndex: 'Vue',
    key: 'Vue',
  },
  {
    title: 'React 访问量',
    dataIndex: 'React',
    key: 'React',
  },
  {
    title: 'Vue2 访问量',
    dataIndex: 'Vue2',
    key: 'Vue2',
  },
  {
    title: 'Webpack 访问量',
    dataIndex: 'Webpack',
    key: 'Webpack',
  },
  {
    title: '课程访问量',
    dataIndex: 'Lesson',
    key: 'Lesson',
  },
];
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

    handleGithubCrowllerClick = () => {
        request.get('/api/getGithubData')
            .then(res => {
                const data: responseResult.getData = res.data
                if (data) {
                    message.success('爬取成功')
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

    getTableData = () => {
        const { data } = this.state
        const tableData: object[] = []
        Object.keys(data).forEach(time => {
            let date = dayjs(Number(time)).format('YYYY-MM-DD HH:mm:ss')
            let itemData = data[time]
            let tableItemData: {
                [key: string]: number | string
            } = {}
            for (let index in itemData) {
                let key = TableKeys[index]
                tableItemData[key] = itemData[index].count
            }
            tableItemData.date = date
            tableData.push(tableItemData)
        })

        return tableData
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
            times.push(dayjs(Number(i)).format('MM-DD HH:mm'))
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
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
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
                            <Button type="primary" onClick={this.handleGithubCrowllerClick}>爬取Github</Button>
                            <Button type="primary" onClick={this.handleShowDataClick}>展示</Button>
                            <Button type="primary" onClick={this.handleLogoutClick}>退出</Button>
                        </div>

                        <Tabs defaultActiveKey="1">
                            <TabPane tab="表格" key="1">
                                <Table dataSource={this.getTableData()} columns={columns} />
                            </TabPane>
                            <TabPane tab="趋势图" key="2">
                                <ReactEcharts option={this.getOptions()} />
                            </TabPane>
                        </Tabs>
                    </div>
                )
            }

            return null
        }
        return <Redirect to="/login" />
    }

}

export default Home