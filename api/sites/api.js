import base from '../base'
import { success, fail } from '../api_response'

class SitesAPI {
    static list = async payload => {
        let promise = await base.GET({
            slug: 'sites/list/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static add = async payload => {
        let promise = await base.POST({
            slug: 'sites/add/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static edit = async payload => {
        let promise = await base.POST({
            slug: 'sites/edit/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static deactivate = async payload => {
        let promise = await base.POST({
            slug: 'sites/deactivate/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static restore = async payload => {
        let promise = await base.POST({
            slug: 'sites/restore/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static archive = async payload => {
        let promise = await base.GET({
            slug: 'sites/archive/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static view = async payload => {
        let promise = await base.POST({
            slug: 'sites/view/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static assign_project = async payload => {
        let promise = await base.POST({
            slug: 'sites/assign-project/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static unassign_project = async payload => {
        let promise = await base.POST({
            slug: 'sites/unassign-project/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static assign_employee = async payload => {
        let promise = await base.POST({
            slug: 'sites/assign-employee/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static unassign_employee = async payload => {
        let promise = await base.POST({
            slug: 'sites/unassign-employee/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static deploy_employee_to_project = async payload => {
        let promise = await base.POST({
            slug: 'sites/deploy-employee-to-project/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }
}

export default SitesAPI
