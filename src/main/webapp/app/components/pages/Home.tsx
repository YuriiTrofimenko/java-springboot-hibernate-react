import React, { Component } from 'react'
import {inject, observer} from "mobx-react"
import { withRouter, RouteComponentProps } from "react-router-dom"
import {CommonStore} from "app/stores/CommonStore"
import {UserStore} from "app/stores/UserStore"

interface MatchParams {
    out: string
}

interface IProps extends RouteComponentProps<MatchParams> {
    commonStore: CommonStore,
    userStore: UserStore
}

interface IState {
}

@inject("commonStore", "userStore")
@observer
@withRouter
class Home extends Component <IProps, IState> {
    componentDidMount() {
        if (this.props.match && this.props.match.params.out) {
            this.props.userStore.logout()
        }
    }
    render () {
        return (
            <div>
                <h1>Home Page</h1>
                <div>Home Page Content: {this.props.commonStore.loading ? this.props.commonStore.error : 'no errors'}</div>
            </div>
        )
    }
}

export default Home