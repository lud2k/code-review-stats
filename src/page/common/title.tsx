
import * as React from 'react'
import Typography from 'material-ui/Typography'
import {Config} from '../../../cli/config'

export class Title extends React.Component<{ config: Config, section?: string, subSection?: string}, {}> {
    getTitle() {
        const {config, section, subSection} = this.props
        let title = config.title || 'Code Review Stats'
        if (section) {
            title += ` | ${section}`
        }
        if (subSection) {
            title += ` | ${subSection}`
        }
        return title
    }

    componentDidMount() {
        document.title = this.getTitle()
    }

    componentDidUpdate() {
        document.title = this.getTitle()
    }

    render() {
        return (
            <Typography type='title' color='inherit' style={{ flex: 1 }}>
                {this.getTitle()}
            </Typography>
        )
    }
}
