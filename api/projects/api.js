import base from '../base'
import {success, fail} from '../api_response'

class ProjectsAPI {

    static list = async (payload ) => {
        let promise = await base.GET({
            slug: 'projects/list/',
            payload: payload,
            headers: {},
            success: (data) => success(data),
            fail: (err) => fail(err)
        })

        return promise
    }

}

export default ProjectsAPI