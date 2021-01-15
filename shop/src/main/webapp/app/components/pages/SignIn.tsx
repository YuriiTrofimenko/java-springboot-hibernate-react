import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import {inject, observer} from "mobx-react"
// import { reaction } from "mobx"
import {Button, Card, CardContent, Grid, Icon, StyledProps, TextField, WithStyles, withStyles} from "@material-ui/core"
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
// тип CommonStore экспортируется из модуля
// не по умолчанию,
// поэтому здесь импортируется в фигурных скобках,
// и его имя должно быть указано точно так же,
// как было указано при экспорте
import {CommonStore} from "app/stores/CommonStore";
import {CategoryStore} from "app/stores/CategoryStore";
import {UserStore} from "app/stores/UserStore";

interface IProps extends WithStyles<typeof styles> {
    commonStore: CommonStore,
    userStore: UserStore
}

interface IState {
}

const styles = theme =>
    ({
        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        signInGrid: {
            minHeight: '100vh'
        },
        card: {
            width: 275
        },
    })

@inject("commonStore", "userStore")
@withRouter
@observer
class SignIn extends Component<IProps, IState> {

    componentWillUnmount() {
        this.props.userStore.reset()
    }

    // обработчик события изменения значения в поле
    // ввода имени пользователя
    handleUserNameChange = e => {
        // установка свойства состояния "имя пользователя"
        // (читаем из аргументов события атрибут value поля ввода,
        // для коротого обрабатывается событие)
        this.props.userStore.setUserName(e.target.value)
    }

    handlePasswordChange = e => {
        this.props.userStore.setPassword(e.target.value)
    }

    handleSubmitForm = e => {
        // предотвращаем отправку данных формы на сервер браузером
        // и перезагрузку страницы
        e.preventDefault()
        // вызываем в хранилище действие входа в учетную запись
        this.props.userStore.login()
    }

    render () {
        const { loading } = this.props.commonStore
        const { userName, password } = this.props.userStore
        const { classes } = this.props
        return (
            <Grid container
                  spacing={0}
                  direction='column'
                  alignContent='center'
                  justify='center'
                  className={classes.signInGrid}
            >
                <Grid item
                      xs={12}
                      sm={12}
                      md={3}
                      lg={3}
                      xl={3}
                >
                    <Card className={classes.card}>
                        <CardContent>
                            <form className={classes.root}
                                  noValidate
                                  autoComplete="off"
                                  title="Sign In"
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
                                        type="password"
                                        onChange={this.handlePasswordChange}
                                    />
                                </div>
                                <div>
                                    <Button
                                        variant='outlined'
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
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(SignIn)