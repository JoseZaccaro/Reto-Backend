import videoController from "./video.controller"
import videoManager from "./videomanager.controller"
import path from "path"
class VIDEOPROCESSCONTROLLER {
    // __dirname
    // fs
    // syncDir
    // implementar la funcion createoutputpath
    // convertfile
    // retornar el path de video
    async convert(originUrlVideo: string, videoId: any) {
        try {
            await videoController.createStatusProcessVideo('download', videoId)

            const localPathVideo = await this.downloadFile(originUrlVideo)

            await videoController.createStatusProcessVideo('validate', videoId)

            const isValidFile = await this.validateFile(localPathVideo)

            // if(!isValidFile) throw new Error('Error en el archivo')
            const outputVideoPath = await this.createOutputPath(originUrlVideo)

            await videoController.createStatusProcessVideo('convert', videoId)

            await this.convertFile(localPathVideo, outputVideoPath)

            await videoController.createStatusProcessVideo('upload', videoId)

            // const newOriginUrlVideoConvert = await this.uploadFile(outputVideoPath)

            await videoController.createStatusProcessVideo('notified', videoId)

            // this.logExecuteProcess(newOriginUrlVideoConvert)
            // return newOriginUrlVideoConvert
            return {
                outputPath: outputVideoPath
            }
        } catch (error) {
            await videoController.createStatusProcessVideo('error', videoId)
            throw error
        }
    }

    async downloadFile(originUrlVideo: string) {
        return originUrlVideo
    }
    // ffprobe
    async validateFile(localPathVideo: string) {
        // ffprobeFromSpawn(localPathVideo)
        // return true/false
        return true
    }

    async createOutputPath(originUrlVideo: string) {
        let filename = path.basename(originUrlVideo).replace("webm","mp4")
        let outputPath = path.join(__dirname+"/../../"+filename)
        console.log("OUTPUTPATH =====> "+outputPath);
        
        // let cortado = outputUrlVideo.split("/")
        // let archivo = cortado.pop().split(".")[0]
        // let pathConvertido = archivo+".mp4"
        // let outputPath = cortado.join("/")+`/${pathConvertido}`
        

        
        // // console.log("ARCHIVO convertido --------->>> "+ pathConvertido)
        // // console.log("ORIGINAL --------->>> "+ outputUrlVideo)
        // // console.log("output --------------------------->>>>>>>"+outputPath);
        return (outputPath);
    }

    async convertFile(localPathVideo: string, ouputPath: string) {
        try {
            await videoManager.changeFormatVideo(localPathVideo,ouputPath)
            // ffmpegFromSpawn(localPath, ouputPath)
        } catch (error) {
            throw error
        }
    }

    async uploadFile(ouputPath: string) {
        try {
            // subir el file y retornal el newOriginUrlVideoConvert
            return ''
        } catch (error) {
            throw error
        }
    }

    logExecuteProcess(newOriginUrlVideoConvert: string) {
        console.log("🚀 ~ >>>>>>> newOriginUrlVideoConvert", newOriginUrlVideoConvert)
    }
}

export default new VIDEOPROCESSCONTROLLER()