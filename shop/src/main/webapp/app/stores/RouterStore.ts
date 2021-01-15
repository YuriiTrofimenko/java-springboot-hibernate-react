import {action, observable, reaction} from "mobx"
import Home from "../components/pages/Home"
import Shopping from "../components/pages/Shopping"
import SignIn from "../components/pages/SignIn"
import SignUp from "../components/pages/SignUp"
import userStore from './UserStore'
import Dashboard from "../components/pages/admin/Dashboard"
import DashboardCategories from "../components/pages/admin/DashboardCategories"
import DashboardProducts from "../components/pages/admin/DashboardProducts"

class RouterStore {

    // список моделей роутов для гостя
    private anonymousRoutes: Array<object> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/signin', name: 'Sign in', Component: SignIn },
        { path: '/signup', name: 'Register', Component: SignUp }
    ]

    // список моделей роутов для аунтентифицированного пользователя
    private loggedRoutes: Array<object> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/auth:out', name: 'Sign out', Component: Home }
    ]

    private adminRoutes: Array<object> = [
        { path: '/', name: 'Home', Component: Home },
        { path: '/shopping', name: 'Shopping', Component: Shopping },
        { path: '/admin', name: 'Dashboard', Component: Dashboard },
        { path: '/admin/categories', name: 'DashboardCategories', Component: DashboardCategories },
        { path: '/admin/products', name: 'DashboardProducts', Component: DashboardProducts },
        { path: '/auth:out', name: `Sign out`, Component: Home }
    ]

    // наблюдаемый текущий список роутов
    // (по умолчнию - для гостя)
    @observable routes: Array<object> = this.anonymousRoutes

    // установить в качестве текущего список роутов для гостя
    @action setAnonymousRoutes() {
        this.routes = this.anonymousRoutes
    }

    // установить в качестве текущего список роутов для аунтентифицированного пользователя
    @action setLoggedRoutes() {
        this.routes = this.loggedRoutes
    }

    @action setAdminRoutes() {
        this.routes = this.adminRoutes
    }

    // реакция на изменение значения наблюдаемого свойства userStore.user:
    // если userStore.user установлен,
    // в текущем списке моделей роутов ищем
    // модель, в свойстве name которой содержится подстрока 'Sign out'
    userReaction = reaction(
        () => userStore.user,
        (user) => {
            console.log('reaction - user: ' + user)
            if (user) {
                let signOutRoute
                // TODO refactoring
                if (user.roleName === 'ROLE_ADMIN') {
                    signOutRoute =
                        this.adminRoutes
                            .find(route => route['name'].includes('Sign out'))
                } else {
                    signOutRoute =
                        this.loggedRoutes
                            .find(route => route['name'].includes('Sign out'))
                }
                // в модель роута "Выход" в свойство name
                // записываем текст: Sign out + ИМЯ_ПОЛЬЗОВАТЕЛЯ,
                // где ИМЯ_ПОЛЬЗОВАТЕЛЯ узнаем из наблюдаемого свойства userStore.user
                signOutRoute['name'] = `Sign out (${userStore.user.name})`
            }
        }
    )
}

export {RouterStore}
export default new RouterStore()