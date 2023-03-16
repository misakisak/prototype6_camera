import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
// import { FaceLandmarksDetector, faceLandmarksDetection } from '@tensorflow-models/face-landmarks-detection';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [smile, setSmile] = useState(null);
  const [smileimage, setSmilemage] = useState(null);

  const [leftimage, setLeftimage] = useState(null);
  const [lefteye, setLefteye] = useState(null);

  const [rightimage, setRightimage ] = useState(null);
  const [righteye, setRighteye] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      // const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async() => {
      if(camera) {
          const data = await camera.takePictureAsync(null);
        //   console.log(data.uri)
        setImage(data.uri);
        console.log(data.uri);
      }
  }

  const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
        //   mediaTypes: ImagePicker.MediaTypeOptions.All, <- if it was all it allow any type of image, video...
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
      });
      console.log(result);

      if (!result.cancelled) {
          setImage(result.uri);
      }
  }; 

  const handleFacesDetected = ({ faces }) => {
    // console.log(faces[0]);
    console.log(faces[0]);
    console.log(faces[0].smilingProbability);
    setSmile(faces[0]["smilingProbability"]);
    if (smile > 0.5) {
      setSmilemage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMR9Sg_DZZoNyNqqTlDctR0PgYe9t5mqGPJA&usqp=CAU");
    } else {
      setSmilemage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRiIZ-eovdcP9y_ggeS9YNzYJihgLNhSBPJg&usqp=CAU');
    }

    console.log(faces[0].leftEyeOpenProbability);
    setLefteye(faces[0]["leftEyeOpenProbability"]);
    if (lefteye > 0.7) {
      setLeftimage("https://thumb.ac-illust.com/1f/1f6af8696ff26d604faed153dd362a1d_t.jpeg");
    } else {
      setLeftimage('https://thumb.ac-illust.com/e2/e25138239ab50fb8e744f771ae3a031b_t.jpeg');
    }

    // console.log(faces[0].rightEyeOpenProbability);
    console.log(faces[0].rightEyePosition);
    setRighteye(faces[0]["rightEyeOpenProbability"]);
    if (righteye > 0.7) {
      setRightimage("https://thumb.ac-illust.com/1f/1f6af8696ff26d604faed153dd362a1d_t.jpeg");
    } else {
      setRightimage('https://thumb.ac-illust.com/e2/e25138239ab50fb8e744f771ae3a031b_t.jpeg');
    }
    console.log('-----')
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <Camera
          ref={ref => setCamera(ref)} 
          style={styles.fixedRatio}
          type={type}
          ratio={'1:1'}
          onFacesDetected={handleFacesDetected}
          faceDetectorSettings={{
            mode: FaceDetector.FaceDetectorMode.fast,
            detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
            /*FaceDetectorLandmarks 顔のパーツの位置を教えてくれる*/
            runClassifications: FaceDetector.FaceDetectorClassifications.all,
            /*FaceDetectorClassifications 笑っているか、目が開いているかを教えてくれる*/
            minDetectionInterval: 50,
            tracking: true,
          }}
        />
      </View>

      <View style={{flex: 1, flexDirection: 'row'}}>
        <Button
          title="Flip Image"
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constrants.Type.back
            );
          }}>
        </Button>
        <Button title="Take Picture" onPress={() => takePicture()}/>
        <Button title="Pick Image From Gallery" onPress={() => pickImage()}/>
        {/* <Button title="Save" onPress={() => navigation.navigate('Save', { image })}/> */}
        {/* {image && <Image source={{uri: image}} style={{flex: 1, flexDirection: 'row'}}/>} */}
      </View>

      <View style={{ flex: 1, flexDirection: 'row'}}>
        {leftimage && <Image source={{uri: leftimage}}  style={{ flex: 1, flexDirection: 'row'}}/>}
        {rightimage && <Image source={{uri: rightimage}} style={{ flex: 1, flexDirection: 'row'}}/>}
      </View>

      <View style={{flex: 1}}>
        {smileimage && <Image source={{uri: smileimage}} style={{flex: 1, flexDirection: 'column'}}/>} 
      </View>      

    </View>
  );
};

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
})
