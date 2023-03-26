import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, Animated } from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
// import { FaceLandmarksDetector, faceLandmarksDetection } from '@tensorflow-models/face-landmarks-detection';
import * as FaceDetector from 'expo-face-detector';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState("");
  const [hasGalleryPermission, setHasGalleryPermission] = useState("");
  const [camera, setCamera] = useState(false);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [smile, setSmile] = useState(0.0);
  const [smileimage, setSmilemage] = useState(null);

  const [leftimage, setLeftimage] = useState(null);
  const [lefteye, setLefteye] = useState(0.0);

  const [XrightEyePosition, setXrightEyePosition] = useState(0.0);
  const [YrightEyePosition, setYrightEyePosition] = useState(0.0);

  const [XleftEyePosition, setXleftEyePosition] = useState(0.0);
  const [YleftEyePosition, setYleftEyePosition] = useState(0.0);

  const [heightSize, setHeightSize] = useState(0.0);
  const [widthSize, setWidthSize] = useState(0.0);

  const [rightimage, setRightimage ] = useState(0.0);
  const [righteye, setRighteye] = useState(0.0);

  const [XrightEarPosition, setXrightEarPosition] = useState(0.0);
  const [YrightEarPosition, setYrightEarPosition] = useState(0.0);

  const [XleftEarPosition, setXleftEarPosition] = useState(0.0);
  const [YleftEarPosition, setYleftEarPosition] = useState(0.0);
  
  const leftEar = "data:image/jpeg;base64,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"
  const rightEar = "data:image/png;base64,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"

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
        // console.log(data.uri);
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
      // console.log(result);

      if (!result.cancelled) {
          setImage(result.uri);
      }
  }; 

  const handleFacesDetected = ({ faces }) => {
    console.log(faces[0]);
    // console.log(faces);
    // console.log(faces[0].smilingProbability);
    setSmile(faces[0]["smilingProbability"]);
    if (smile > 0.5) {
      setSmilemage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMR9Sg_DZZoNyNqqTlDctR0PgYe9t5mqGPJA&usqp=CAU");
    } else {
      setSmilemage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRiIZ-eovdcP9y_ggeS9YNzYJihgLNhSBPJg&usqp=CAU');
    }

    // console.log(faces[0].leftEyeOpenProbability);
    setLefteye(faces[0]["leftEyeOpenProbability"]);
    if (lefteye > 0.7) {
      setLeftimage("https://thumb.ac-illust.com/1f/1f6af8696ff26d604faed153dd362a1d_t.jpeg");
    } else {
      setLeftimage('https://thumb.ac-illust.com/e2/e25138239ab50fb8e744f771ae3a031b_t.jpeg');
    }
    
    // console.log(faces[0].rightEyePosition.x);
    setXrightEyePosition(faces[0].rightEyePosition.x)
    setYrightEyePosition(faces[0].rightEyePosition.y)
    setXleftEyePosition(faces[0].leftEyePosition.x)
    setYleftEyePosition(faces[0].leftEyePosition.y)

    // console.log("aaaaa")
    console.log(faces[0].bounds.size.height)
    setWidthSize(faces[0].bounds.size.width)
    setHeightSize(faces[0].bounds.size.height)

    setXrightEarPosition(faces[0].rightEarPosition.x)
    setYrightEarPosition(faces[0].rightEarPosition.y)
    setXleftEarPosition(faces[0].leftEarPosition.x)
    setYleftEarPosition(faces[0].leftEarPosition.y)



    // console.log(faces[0].rightEyePosition);
    setRighteye(faces[0]["rightEyeOpenProbability"]);
    if (righteye > 0.7) {
      setRightimage("https://thumb.ac-illust.com/1f/1f6af8696ff26d604faed153dd362a1d_t.jpeg");
    } else {
      setRightimage('https://thumb.ac-illust.com/e2/e25138239ab50fb8e744f771ae3a031b_t.jpeg');
    }
    // console.log('-----')
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

      <View style={{ flexDirection: 'column'}}>
        {rightimage && <Image source={{uri: rightimage}}  style={{height: heightSize/5, width: widthSize/5, transform: [{translateX: XrightEyePosition}, {translateY:YrightEyePosition}]}}/>}
        {leftimage && <Image source={{uri: leftimage}}  style={{height: heightSize/5, width: widthSize/5, transform: [{translateX: XleftEyePosition}, {translateY:YleftEyePosition}]}}/>}
      </View>

      <View style={{ flexDirection: 'column'}}>
        <Image source={{uri: leftEar}}  style={{height: heightSize/10, width: widthSize/10, transform: [{translateX: XleftEarPosition}, {translateY:YleftEarPosition}]}}/>
        <Image source={{uri: rightEar}}  style={{height: heightSize/10, width: widthSize/10, transform: [{translateX: XrightEarPosition}, {translateY:YrightEarPosition}]}}/>
      </View>

      <View>
        {smileimage && <Image source={{uri: smileimage}} style={{height: heightSize/2, width: widthSize/2, transform: [{translateX: XleftEyePosition}, {translateY:YleftEyePosition}]}}/>} 
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
  transformsR:{
    // transform:[XrightEyePosition, YrightEyePosition]
  },
  transformsL:{
    // transform:[XleftEyePosition, YleftEyePosition]
  }
})
