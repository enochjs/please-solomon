import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Row, Col, Slider, message } from 'antd'
import './index.less'
import './svg/iconfont.css'

/** 歌词每行高度 */
const PHEIGHT = 36
const STARTLINENUM = 3

interface IProps {
  audioId?: string,
  musiclist: Array<{ lrc: any, src: string }>
  cycle?: boolean
  showPlayPrev?: boolean,
  showPlayNext?: boolean,
  showRightOperate?: boolean,
  size?: string,
  delayPlay?: null,
  showTime?: boolean,
  duration?: number,
  showSlider?: boolean
}

interface IState {
  playing: boolean,
  currentTime: number,
  volume: number,
  showVolume: boolean,
  end: boolean,
  currentLine: number,
  currentMusicIndex: number,
  showLrc: boolean,
  playType: 'orderPlay' | 'shufflePlay' | 'singlePlay',
}

class ReactAudio extends Component<IProps, IState> {

  constructor (props: IProps) {
    super(props)
    this.state = {
      playing: false,
      currentTime: 0,
      volume: 100,
      showVolume: false,
      end: true,
      currentLine: 0,
      currentMusicIndex: 0,
      showLrc: false,
      playType: 'orderPlay',
    }
  }

  audio: any

  lrcContainer: any

  lrcContainerDOM: any

  timeInterval: any

  componentDidMount () {
    const { audioId } = this.props
    const audio = document.getElementById(audioId || 'audio')
    this.audio = audio
  }

  handlePlay = () => {
    this.setState({ playing: true }, () => {
      this.audioPlay()
    })
  }

  getCurrentLine = () => {
    const { musiclist } = this.props
    const { currentMusicIndex } = this.state
    let currentLine = this.state.currentLine
    musiclist[currentMusicIndex].lrc.map((lrc, index) => {
      if (lrc.timeStart <= this.state.currentTime && lrc.timeEnd > this.state.currentTime) {
        currentLine = index
      }
    })
    return currentLine
  }

  handleScrollLrc = (currentLine) => {
    if (currentLine > 3) {
      this.lrcContainerDOM.scrollTo(0, PHEIGHT * (currentLine - STARTLINENUM))
    } else {
      this.lrcContainerDOM.scrollTo(0, 0)
    }
  }

  audioPlay = () => {
    if (!this.props.musiclist.length) {
      message.error('没有数据')
    }
    if (!this.state.playing) {
      return false
    }
    this.audio.play().then(() => {
      this.lrcContainerDOM = ReactDOM.findDOMNode(this.lrcContainer)
      clearInterval(this.timeInterval)
      this.timeInterval = setInterval(() => {
        const currentLine = this.getCurrentLine()
        // 播放结束
        if (this.audio.duration === this.state.currentTime ) {
          this.handleAudioEnd()
        } else {
          if (currentLine === this.state.currentLine) {
            this.setState({ currentTime: this.audio.currentTime })
          } else {
            this.setState({ currentTime: this.audio.currentTime, currentLine }, () => {
              this.handleScrollLrc(currentLine)
            })
          }
        }
      }, 300)
    })
    return true
  }

  /** 播放结束相关处理 */
  handleAudioEnd = () => {
    const { musiclist } = this.props
    if (this.state.playType === 'singlePlay') {
      // 单曲循环
      this.setState({ currentLine: 0, currentTime: 0 }, () => {
        this.audioPlay()
        this.handleScrollLrc(this.state.currentLine)
      })
    } else if (this.state.playType === 'shufflePlay') {
      // 随机播放
      this.setState({ currentLine: 0, currentTime: 0, currentMusicIndex: Math.floor((Math.random() * musiclist.length )) }, () => {
        this.audioPlay()
        this.handleScrollLrc(this.state.currentLine)
      })
    } else if (this.props.cycle) {
      this.handlePlayNext()
    } else {
      this.setState({ playing: false, currentTime: 0 })
      clearInterval(this.timeInterval)
    }
  }

  handlePause = (cb) => {
    this.setState({ playing: false }, () => {
      this.audio.pause()
      typeof cb === 'function' && cb()
    })
  }

  handlePlayNext = () => {
    const { musiclist } = this.props
    const { currentMusicIndex } = this.state
    if (currentMusicIndex === musiclist.length - 1) {
      this.setState({ currentMusicIndex: 0, currentLine: 0, currentTime: 0 }, () => { this.audioPlay() })
    } else {
      this.setState({ currentMusicIndex: currentMusicIndex + 1, currentLine: 0, currentTime: 0 }, () => { this.audioPlay() })
    }
  }

  handlePlayPrev = () => {
    const { currentMusicIndex } = this.state
    const { musiclist } = this.props
    if (currentMusicIndex === 0) {
      this.setState({ currentMusicIndex: musiclist.length - 1, currentLine: 0, currentTime: 0 }, () => { this.audioPlay() })
    } else {
      this.setState({ currentMusicIndex: currentMusicIndex - 1, currentLine: 0, currentTime: 0 }, () => { this.audioPlay() })
    }
  }

  handleTimeChange = (value) => {
    this.setState({ currentTime: value }, () => {
      this.audio.currentTime = value
      this.handleScrollLrc(this.getCurrentLine())
    })
  }

  handleTipFormatter = (value) => {
    const minute = Math.floor(value / 60)
    const second = parseInt(value, 10) % 60
    return `${minute < 10 ? '0' + minute : minute}:${second < 10 ? '0' + second : second }`
  }

  handleVolumeChange = (value) => {
    this.setState({ volume: value }, () => {
      this.audio.volume = value / 100
    })
  }

  handlePlayType = (playType: IState['playType']) => {
    let curPlayType = this.state.playType
    switch (playType) {
    case 'orderPlay': curPlayType = 'shufflePlay'; break
    case 'shufflePlay': curPlayType = 'singlePlay'; break
    case 'singlePlay': curPlayType = 'orderPlay'; break
    default: break
    }
    this.setState({ playType: curPlayType }, () => {
      this.audio.loop = this.state.playType === 'singlePlay'
    })
  }

  handleToggleVolume = () => {
    this.setState({ showVolume: !this.state.showVolume })
  }

  handleToggleLrc = () => {
    this.setState({ showLrc: !this.state.showLrc }, () => {
      this.handleScrollLrc(this.state.currentLine)
    })
  }

  formatTime = (t) => {
    const time = parseInt(t, 10)
    let min: string | number = Math.floor(time / 60)
    let sec: string | number = time % 60
    min = min < 10 ? '0' + min : min
    sec = sec < 10 ? '0' + sec : sec
    return `${min}:${sec}`
  }

  render () {
    const { playing, currentTime, volume, currentLine, currentMusicIndex, showLrc, playType } = this.state
    const { musiclist, showPlayPrev, showPlayNext, showRightOperate, size, delayPlay, showTime, audioId, showSlider } = this.props
    const duration = this.audio && (this.audio.duration && this.audio.duration !== Number.POSITIVE_INFINITY) ?
      this.audio.duration : (this.props.duration ? this.props.duration : 0)
    return (
      <div className={`react-audio ${size}`}>
        <audio
          id={audioId || 'audio'}
          controls={false}
          src={musiclist[currentMusicIndex] ? musiclist[currentMusicIndex].src : ''}
          {...this.props}
        />
        <Row>
          <Col span={3} className="audio-btns">
            {showPlayPrev ? <i className="iconfont icon-audio-prev" title="上一曲" onClick={this.handlePlayPrev} /> : null}
            <i className={playing ? 'hide' : 'iconfont icon-audio-play'} title="播放" onClick={delayPlay ? delayPlay : this.handlePlay} />
            <i className={playing ? 'iconfont icon-audio-pause' : 'hide'} title="暂停" onClick={this.handlePause} />
            {showPlayNext ? <i className="iconfont icon-audio-next" title="下一曲" onClick={this.handlePlayNext} /> : null}
          </Col>
          {}
          <Col className="audio-play" span={showTime ? 12 : 15}>
            {
              showSlider ? <Slider
                max={this.audio ? Math.ceil(this.audio.duration) : 0}
                value={currentTime}
                onChange={this.handleTimeChange}
                tipFormatter={this.handleTipFormatter}
              /> : null
            }
          </Col>
          {
            showTime ? <Col className="audio-time" span={3}>
              <span>{this.formatTime(currentTime)}</span>/<span>{this.formatTime(duration)}</span>
            </Col> : null
          }
          {
            showRightOperate ?
            <Col span={4} className="audio-btns audio-btns-right">
              <div className={this.state.showVolume ? 'audio-sound' : 'audio-sound hide'}>
                <Slider
                  vertical={Boolean(true)}
                  value={volume}
                  onChange={this.handleVolumeChange}
                  tipFormatter={(value) => `${value}%`}
                />
              </div>
              <i className="iconfont icon-yinliang" title="音量" onClick={this.handleToggleVolume} />
              <i className={playType === 'orderPlay' ? 'iconfont icon-audio-cicle' : 'hide'} onClick={() => this.handlePlayType('orderPlay')} />
              <i className={playType === 'singlePlay' ? 'iconfont icon-audio-one-cicle' : 'hide'} onClick={() => this.handlePlayType('singlePlay')} />
              <i className={playType === 'shufflePlay' ? 'iconfont icon-audio-random' : 'hide'} onClick={() => this.handlePlayType('shufflePlay')} />
              <i className="iconfont icon-audio-file" title="歌词" onClick={this.handleToggleLrc} />
            </Col> : null
          }
        </Row>
        <div ref={(r) => this.lrcContainer = r} className={showLrc ? 'lrc-container align-center unselectable' : 'hide'}>
          {
            musiclist[currentMusicIndex] && musiclist[currentMusicIndex].lrc.map((lrc, index) => {
              let className = 'lrc '
              if (lrc.isTile === true) {
                className += 'lrc-title '
              }
              if (currentLine === index) {
                className += 'lrc-action'
              }
              return <p key={index} className={className}>{lrc.lrc}</p>
            })
          }
        </div>
      </div>
    )
  }
}
export default ReactAudio
