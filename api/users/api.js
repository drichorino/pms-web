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

    static create = async payload => {
        let promise = await base.POST({
            slug: 'users/create/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static edit = async payload => {
        let promise = await base.POST({
            slug: 'users/edit/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static deactivate = async payload => {
        let promise = await base.POST({
            slug: 'users/deactivate/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static restore = async payload => {
        let promise = await base.POST({
            slug: 'users/restore/',
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

    static current = async payload => {
        let promise = await base.GET({
            slug: 'users/current/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }
}

export default UsersAPI
