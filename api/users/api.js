import base from '../base'
import { success, fail } from '../api_response'

class UsersAPI {
    static login = async payload => {
        let promise = await base.POST({
            slug: 'login/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static logout = async () => {
        let promise = await base.POST({
            slug: 'logout/',
            payload: {},
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static list = async payload => {
        let promise = await base.GET({
            slug: 'users/list/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static archive = async payload => {
        let promise = await base.GET({
            slug: 'users/archive/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }
}

export default UsersAPI
