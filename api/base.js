import axios from 'axios';
import config from '../nuxt.config.js'

axios.defaults.withCredentials = true

class REQUEST {

    static POST = async (params) => {
        console.log(`${config.host.host}/${params.slug}`)
        let promise = await axios.post(`${config.host.host}/${params.slug}`, params.payload)
                            .then(
                                (data) => params.success(data)
                                )
                            .catch(
                                (err) => params.fail(err)
                                )
                 
        return promise
    }

    static GET = async (params) => {
        console.log(`${config.host.host}/${params.slug}`)
        let promise = await axios.get(`${config.host.host}/${params.slug}`, params.payload)
                            .then(
                                (data) => params.success(data)
                                )
                            .catch(
                                (err) => params.fail(err)
                                )
        return promise
     }
}

export default REQUEST;