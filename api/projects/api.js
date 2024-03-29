import base from '../base'
import { success, fail } from '../api_response'

class ProjectsAPI {
    static list = async payload => {
        let promise = await base.GET({
            slug: 'projects/list/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static add = async payload => {
        let promise = await base.POST({
            slug: 'projects/add/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static edit = async payload => {
        let promise = await base.POST({
            slug: 'projects/edit/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static deactivate = async payload => {
        let promise = await base.POST({
            slug: 'projects/deactivate/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static restore = async payload => {
        let promise = await base.POST({
            slug: 'projects/restore/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }

    static archive = async payload => {
        let promise = await base.GET({
            slug: 'projects/archive/',
            payload: payload,
            headers: {},
            success: data => success(data),
            fail: err => fail(err)
        })

        return promise
    }
}

export default ProjectsAPI
