import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import {Button, Icon, TextField, withStyles, WithStyles} from "@material-ui/core"
import {CommonStore} from "../../stores/CommonStore";
import {UserStore} from "../../stores/UserStore";

// типизация для свойств компонента: унаследованное свойство classes
// + расширяющие свойства commonStore и userStore
interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    userStore: UserStore
}

// типизация для состояния компонента:
// ни одного свойства состояния какого-либо типа нет
interface IState {
}

const styles = theme =>
    ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        }
    })

@inject("commonStore", "userStore")
@observer
// применение типизации
class SignUp extends Component<IProps, IState> {

    componentWillUnmount() {
        this.props.userStore.reset()
    }

    handleUserNameChange = e => {
        this.props.userStore.setUserName(e.target.value)
    }

    handlePasswordChange = e => {
        this.props.userStore.setPassword(e.target.value)
    }

    handleSubmitForm = e => {
        e.preventDefault()
        this.props.userStore.register()
    }

    render () {
        const { loading } = this.props.commonStore
        const { userName, password } = this.props.userStore
        const { classes } = this.props
        return (
            <form
                className={classes.root}
                noValidate
                autoComplete="off"
                title="Register"
            >
                <div>
                    <TextField
                        label='Login'
                        value={userName}
                        onChange={this.handleUserNameChange}
                    />
                </div>
                <div>
                    <TextField
                        label='Password'
                        value={password}
                        onChange={this.handlePasswordChange}
                    />
                </div>
                <div>
                    <Button
                        disabled={loading}
                        onClick={this.handleSubmitForm}
                    >
                        Submit
                        <Icon>
                            send
                        </Icon>
                    </Button>
                </div>
            </form>
        )
    }
}
// обертывание компонента в вспомогательный компонент,
// предоставляющий через props компонента
// свойство classes,
// содержащее все стили, определенные в константе styles
export default withStyles(styles)(SignUp)