import React from 'react';
import Cropper from 'react-easy-crop';
import Modal from '@material-ui/core/Modal';
import imageCompression from 'browser-image-compression';
import CircularProgress from '@material-ui/core/CircularProgress';

// import { getOrientation } from '../../../node_modules/get-orientation/browser';
import getCroppedImg from './cropImage';
// import Loader from './Loader';
// import { getRotatedImage } from './rotateImage';
import './styles.css';

const ORIENTATION_TO_ANGLE = {
  3: 180,
  6: 90,
  8: -90,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maxSizeMB: 1,
      // maxWidthOrHeight: 1024,
      imageDataUrl: null,
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 3,
      croppedAreaPixels: null,
      croppedImageFile: null,
      loadingFile: false,
      loading: false,
    };
    this.compressImage = this.compressImage.bind(this);
  }


  componentWillMount() {
    const { isCroppingRequired, aspect } = this.props;
    if (aspect) {
      this.setState({ isCroppingRequired, aspect });
    } else {
      this.setState({ isCroppingRequired });
    }

    
  }

  onCropChange = (crop) => {
    this.setState({ crop });
  }


  onCropComplete = (croppedArea, croppedAreaPixels) => {
    this.setState({
      croppedAreaPixels,
    });
    this.showResult(croppedAreaPixels);
  }

  onZoomChange = (zoom) => {
    this.setState({ zoom });
  }

  showResult = async (croppedAreaPixels) => {
    try {
      const { imageDataUrl, imgproperties } = this.state;
      const [croppedImageFile, base64img] = await getCroppedImg(
        imageDataUrl,
        croppedAreaPixels,
        imgproperties,
      );

      if (croppedImageFile) {
        // console.log('cropped image', croppedImageFile);\
        this.croppedImageFile = croppedImageFile;
        this.base64img = base64img;
        this.setState({
          croppedImageFile,

        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  onClose = async () => {
    this.setState({
      croppedImageFile: null,
    });
  }

  onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      this.setState({ loadingFile: true });
      const imageDataUrl = await readFile(file);
      if (this.state.isCroppingRequired) {
        this.croppedImageFile = file;
        this.setState({
          tookInput: true,
          imageDataUrl,
          crop: { x: 0, y: 0 },
          zoom: 1,
          imgproperties: file,
          croppedImageFile: file,
          loadingFile: false,
        });
      } else {
        const imagePromise = this.compressImage(file, true);
        const { showLoader, onSelectFile } = this.props;
        if (showLoader) {
          showLoader();
          imagePromise.then((blob) => {
            onSelectFile({ blob, imageDataUrl });
          });
          return;
        }
        imagePromise.then((blob) => {
          onSelectFile({ blob, imageDataUrl });
        });
      }
    }
  }

  async compressImage(file, useWebWorker) {
    const options = {
      maxSizeMB: this.state.maxSizeMB,
      useWebWorker,
    };
    const output = await imageCompression(file, options);
    return output;
  }

  uploadFile(croppedImageFile) {
    // this.setState({ tookInput: false });
    const { imageDataUrl } = this.state;
    const { showLoader, onSelectFile } = this.props;
    if (showLoader) {
      showLoader();
      this.setState({ tookInput: false });
      const imagePromise = this.compressImage(croppedImageFile, false);
      imagePromise.then((blob) => {
        onSelectFile({ blob, imageDataUrl: this.base64img });
      });
      // onSelectFile({ blob: croppedImageFile, imageDataUrl });
    } else {
      this.setState({ loading: true });
      const imagePromise = this.compressImage(croppedImageFile, false);

      imagePromise.then((blob) => {
        this.setState({ loading: false, tookInput: false });
        onSelectFile({ blob, imageDataUrl });
      });
    }
  }

  render() {
    const {
      croppedImageFile, imageDataUrl, tookInput, crop, zoom, aspect, loading,
    } = this.state;
    return (
      <div>
        <div className="">
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/png, image/jpeg"
            className="select-img"
            onChange={this.onFileChange}
          />
        </div>
        <Modal
          open={tookInput}
          aria-labelledby="simple-modal-title"
          className="tc center "
          aria-describedby="simple-modal-description"
        >
          <div className="modal" style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div className=" " style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Cropper
                image={imageDataUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={this.onCropChange}
                onCropComplete={this.onCropComplete}
                onZoomChange={this.onZoomChange}
              />
            </div>
            <button type="button" onClick={() => this.uploadFile(this.croppedImageFile)} className="color-btn  center mt0 pt0 mb0" style={{ height: '50px', zIndex: 50 }}> Upload Cropped Area</button>

            <button type="button" onClick={() => this.setState({ tookInput: false, cropped: false })} className="profile-btn white center mt0 pt0 mb0" style={{ height: '50px', zIndex: 50 }}>  Cancel</button>
            {
          loading
            ? (
              <div className="loading">

                <CircularProgress style={{ width: '40px', height: '40px' }} />
              </div>
            )
            : null
        }
          </div>
        </Modal>

      </div>

    );
  }
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

export default App;
