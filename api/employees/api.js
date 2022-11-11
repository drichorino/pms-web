import base from '../base'
import { success, fail } from '../api_response'

class SitesAPI {
    static list = async payload => {
        let promise = await base.GET({
            slug: 'employees/list/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static add = async payload => {
        let promise = await base.POST({
            slug: 'employees/add/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static edit = async payload => {
        let promise = await base.POST({
            slug: 'employees/edit/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static deactivate = async payload => {
        let promise = await base.POST({
            slug: 'employees/deactivate/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static restore = async payload => {
        let promise = await base.POST({
            slug: 'employees/restore/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static archive = async payload => {
        let promise = await base.GET({
            slug: 'employees/archive/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static view = async payload => {
        let promise = await base.POST({
            slug: 'employees/view/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static add_employee = async payload => {
        let promise = await base.POST({
            slug: 'employees/add-employee/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static unassign_employee = async payload => {
        let promise = await base.POST({
            slug: 'employees/unassign-employee/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }
}

export default SitesAPI
