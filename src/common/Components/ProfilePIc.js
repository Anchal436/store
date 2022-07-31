import React  from 'react';
import './styles.css';
import AddAPhotoOutlinedIcon from '@material-ui/icons/AddAPhotoOutlined';
import SelectImage from './SelectImage';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mainImg: null,
      version: 'pic',
    };
  }

  componentWillMount() {
    const { photo, changProfile, version } = this.props;
    if (changProfile) {
      this.setState({
        changProfilePic: true, mainImg: photo, version,
      });
    } else {
      this.setState({
        changProfilePic: false, mainImg: photo,
      });
    }
  }

  componentWillReceiveProps(np) {
    const { photo, changProfile } = np;
    if (changProfile) {
      this.setState({
        changProfilePic: true, mainImg: photo,
      });
    } else {
      this.setState({
        changProfilePic: false, mainImg: photo,
      });
    }
  }


  render() {
    const { version } = this.state;
    return (
      <div>
        {
          !this.state.changProfilePic
            ? (
              <div className="profile-img-div mt4 mb2 center">
                <div className="center">
                  {
                    (this.state.mainImg)
                      ? <img src={this.state.mainImg} id="a" className="profile-img" alt="" /> : <img src="https://cdn-images-1.medium.com/max/1200/1*PkrwrLwaq68CaqLPn7jBIw.png" className="profile-img" alt="" />
                  }
                </div>
              </div>
            )
            : (
              <div className="">
                {
                  version === 'text' ? (
                    <div className="profile-text-version-div">
                      <SelectImage onSelectFile={this.props.selectProfilePic.bind(this)} isCroppingRequired showLoader={this.props.showLoader}  />
                      <p className="blue f4 b"> Edit </p>
                    </div>
                  )
                    : (
                      <div className="profile-img-div center">
                        <div className="center">
                          <SelectImage onSelectFile={this.props.selectProfilePic.bind(this)} isCroppingRequired showLoader={this.props.showLoader} />
                          {
                          this.state.mainImg ? <img src={this.state.mainImg} id="a" className="profile-img" alt="" />
                            : <AddAPhotoOutlinedIcon className="profile-img" />
                        }
                        </div>
                      </div>
                    )
                }


              </div>
            )
        }
      </div>
    );
  }
}

export default App;
