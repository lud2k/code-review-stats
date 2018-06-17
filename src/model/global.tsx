import {Config} from '../../cli/config'
import {Data} from '../../cli/backend/models'

declare global {
    interface Window {
        config?: Config
        data?: Data
    }
}
