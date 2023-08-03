import React, { PureComponent } from 'react'
import loading from '../assets/loading.gif'

export default class Spinner extends PureComponent {
  render() {
    return (
        <div className="text-center">
            <img src={loading}  className="w-4" alt="loading" srcset="" />
        </div>
    )
  }
}