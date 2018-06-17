import fetch from 'node-fetch'
import {GerritChangeDetail, GerritChangeSummary} from './gerrit-models'
import * as moment from 'moment'
import {Config} from '../../config'
import {Data} from '../models'
import {parseChanges} from './parse'

export const fetchGerritData = async (config: Config, username: string, password: string,
                                      progressFn: (progress: number) => void): Promise<Data> => {
    const response = await login(config.host, username, password)
    const setCookieHeader = response.headers.get('set-cookie')
    const cookie = setCookieHeader.match(/GerritAccount=([^;]+)/)[1]
    return await getData(config, cookie, config.days, progressFn)
}

const get = async (host: string, cookie: string, url: string): Promise<any> => {
    const response = await fetch(`${host}${url}`, {
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'Cookie': `GerritAccount=${cookie};`,
        },
    })
    const data = await response.text()
    const json = data.substr(5)
    return JSON.parse(json)
}

export const login = async (host: string, username: string, password: string): Promise<any> => {
    const response = await fetch(`${host}/login`, {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        body: `username=${username}&password=${password}`,
    })
    if (response.status === 302) {
        return response
    } else if (response.status === 401) {
        throw Error('Invalid username or password')
    } else {
        throw Error('An unknown error has happened:' + response.status)
    }
}

const getChanges = (host: string, cookie: string, query: string, count: number, start: number):
    Promise<GerritChangeSummary[]> => {

    return get(host, cookie, `/a/changes/?q=${query}&n=${count}&start=${start}&o=CURRENT_COMMIT&o=CURRENT_REVISION`)
}

const getChangeDetails = (host: string, cookie: string, id: number): Promise<GerritChangeDetail> => {
    return get(host, cookie, `/a/changes/${id}/detail`)
}

const getChangesUntil = async (host: string, cookie: string, query: string): Promise<GerritChangeSummary[]> => {
    let page = 0
    let changes = await getChanges(host, cookie, query, 50, page * 50)
    while (page < 50) {
        const newChanges = await getChanges(host, cookie, query, 50, page * 50)
        changes = changes.concat(newChanges)
        if (newChanges.length < 50) {
            break
        }
        page++
    }
    return changes
}

export const batch = async (inputs: (() => Promise<GerritChangeDetail>)[], count: number,
                            progressFn: (progress: number) => void): Promise<GerritChangeDetail[]> => {
    const results: GerritChangeDetail[] = []
    const threads: Promise<void>[] = []
    while (count--) {
        const thread = async (): Promise<void> => {
            let input = inputs.pop()
            while (input) {
                results.push(await input())
                progressFn(results.length/(results.length+inputs.length))
                input = inputs.pop()
            }
        }
        threads.push(thread())
    }
    await Promise.all(threads)
    return results
}

export const getData = async (config: Config, cookie: string, nbDays: number, progressFn: (progress: number) => void):
    Promise<Data> => {

    const afterDate = moment().subtract(nbDays, 'days').format('YYYY-MM-DD')
    const query = `after:${afterDate}`

    progressFn(0)

    const changes = await getChangesUntil(config.host, cookie, query)
    const promises = changes.map((change) => () => getChangeDetails(config.host, cookie, change._number))
    const details = await batch(promises, 5, progressFn)
    return { changes: parseChanges(config, details) }
}
