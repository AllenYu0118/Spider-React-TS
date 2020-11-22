import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import request from '../../request'
import qs from 'qs'
import { 
    Form,
    Input,
    Icon,
    Button,
    message,
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form'
import './style.css'

interface FormFields {
    username: string
    password: string
    email: string
}
interface Props {
    form: WrappedFormUtils<FormFields>
}

class RegisterForm extends Component<Props> {
    state = {
        loaded: false,
        isRegister: false,
    }
    handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values) => {
            if (!err) {
                request.post('/api/register', qs.stringify({
                    username: values.username,
                    password: values.password,
                    email: values.email
                }), {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(res => {
                    const data: responseResult.register = res.data
                    if (data) {
                        message.success('注册成功, 请登录账号!', 3, () => {
                            this.setState({
                                isRegister: true
                            })
                        })
                    } else {
                        message.error('注册失败,用户名已存在!')
                    }
                })
            }
        });
    };

    render() {
        const { isRegister } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            isRegister ? <Redirect to="/login" /> :
                <div className="register-page">
                    <Form onSubmit={this.handleRegister} className="login-form">
                        <Form.Item>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名称' }],
                            })(
                                <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="text"
                                    placeholder="Username"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入登陆密码' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('email', {
                                rules: [
                                {
                                    type: 'email',
                                    message: '请输入正确的E-mail!',
                                },
                                {
                                    required: true,
                                    message: '请输入您的E-mail',
                                },
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="email"
                                    placeholder="Email"
                                />
                            )}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="register-btn"> 注 册 </Button>
                        </Form.Item>
                        
                        <Form.Item>
                            已有账号?<Link to="/login">去登录</Link>
                        </Form.Item>
                    </Form>
                </div>
        );
    }
}

const WrappedRegisterForm = Form.create({ name: 'register' })(RegisterForm);

export default WrappedRegisterForm