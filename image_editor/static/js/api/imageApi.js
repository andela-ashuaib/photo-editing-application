import request from 'superagent';
import toastr from 'toastr';
import 'superagent-django-csrf';
import {updatePercentage,
  changeUploadStatus,
  changePreview,
  changeLoadingStatus,
  changeFileName} from '../actions';

// Sets the imageUrl from the preset Dom value
const imageUrl = document.querySelector('meta[name="image_url"]')
                          .getAttribute('content');

const ImageApi = {
  /**
  * Gets all the images from the django backend
  *@param {function} [dispatch] [dispatch action]
  *@param {function} cb the callback function supplied by the component
  */
  getAllImages: (dispatch, cb) => {
    dispatch(changeLoadingStatus(true));
    toastr.info('Loading your images...!', null, {
      timeOut: 0
    });
    request.get(imageUrl)
      .set('Accept', 'application/json')
      .end((err, res) => {
        dispatch(changeLoadingStatus(false));
        toastr.clear();
        if (!err) {
          console.log(res.body.data, 'from the api');
          cb(res.body.data);
        }
      });
  },
  /**
  * Updates image object title and filters
  *@param {function} [dispatch] [dispatch action]
  *@param {object} image the image object to be updated
  *@param {string} filter to be added if present
  *@param {function} [cb] [call back function]
  */
  updateImage(dispatch, image, filter, cb) {
    dispatch(changeLoadingStatus(true));
    toastr.info('Updating ' + image.title + '...', null, {
      timeOut: 0
    });

    request.put(imageUrl)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(image)
      .end((err, res) => {
        toastr.clear();
        dispatch(changeLoadingStatus(false));
        if (err) {
          toastr.error(res.body, 'unable to update ' +
              image.title, {
                closeButton: true
              });
        } else {
          if (filter) {
            toastr.info('Successfully added' +
              filter.toLowerCase() + ' to ' + image.title, '', {
                closeButton: true
              });
          } else {
            toastr.info('Successfully updated ' + image.title, '', {
              closeButton: true
            });
          }
          cb(res.body);
        }
      });
  },
  /**
  * deletes image object  from the database
  *@param {function} [dispatch] [dispatch action]
  *@param {object} imageObj the image object to be updated
  *@param { function} [cb] [description]
  */
  deleteImage(dispatch, imageObj, cb) {
    toastr.error('Deleting ' + imageObj.title + '...', null, {
      timeOut: 0
    });
    dispatch(changeLoadingStatus(true));
    request.del(imageUrl)
      .send(imageObj)
      .end(err => {
        toastr.clear();
        if (!err) {
          dispatch(changeLoadingStatus(false));
          toastr.info('successfully removed ' + imageObj.title, '', {
            closeButton: true
          });
          cb();
        }
      });
  },
  /**
  * Uploads image to the django  backend
  *@param {function} [dispatch] [dispatch action]
  *@param {array} files The array of image files to be uploaded
  *@param {function} [cb] [description]
  */
  uploadImage(dispatch, files, cb) {
    files.forEach(file => {
      dispatch(changeFileName(file.name));
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = e => {
        dispatch(changePreview(e.target.result));
      };
      request.post(imageUrl)
        .attach('image', file, file.name)
        .set('Accept', 'application/json')
        .on('progress', e => {
          if (e.percent) dispatch(updatePercentage(e.percent));
          dispatch(changeUploadStatus(true));
        })
        .end((err, res) => {
          dispatch(changeUploadStatus(false));
          if (err) {
            return toastr.error(res.body, 'unable to upload ' +
              file.name, {
                closeButton: true
              });
          }

          toastr.success('successfully uploaded ' + file.name, '', {
            closeButton: true
          });
          cb(res.body);
        });
    });
  }
};
export default ImageApi;
