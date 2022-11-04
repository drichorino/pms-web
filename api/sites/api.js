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
}

export default SitesAPI
