import axios from 'axios';

export const translationEnglishApi = (data) => {
    return axios({
        method: 'POST',
        url: '/api/v1/ecology/document_translate',
        data
    }).then(res => {
        return res.data.text;
    })
}

export const translationHKhApi = (data) => {
    return axios({
        method: 'POST',
        url: '/api/v1/ecology/s_t_translation',
        data
    }).then(res => {
        return res.data.text;
    })
}