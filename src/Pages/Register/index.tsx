import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
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
        isLogin: false,
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
                    // const data: responseResult.login = res.data
                    // if (data) {
                    //     this.setState({
                    //         isLogin: true
                    //     })
                    // } else {
                    //     message.error('登录失败')
                    // }
                })
            }
        });
    };

    render() {
        const { isLogin } = this.state
        const { getFieldDecorator } = this.props.form;
        return (
            isLogin ? <Redirect to="/" /> :
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
                    </Form>
                </div>
        );
    }
}

const WrappedRegisterForm = Form.create({ name: 'register' })(RegisterForm);

export default WrappedRegisterForm