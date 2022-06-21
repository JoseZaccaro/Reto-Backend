import videoSources from "../backingservice/models/videos/videoSources"
import processVideo from "../backingservice/models/videos/processVideo"
import videoprocesscontroller from "./videoprocess.controller"
import { Types } from 'mongoose'
import path from "path"

class VIDEOCONTROLLER {

    async getVideoList() {
        try {
            const videoList = await videoSources.find()
            return videoList
        } catch (error) {
            console.log(error);
        }
    }
    async deleteOneVideoOfList(_id:string) {

        try {
            const deletedVideo = await videoSources.findOneAndDelete({_id})
            return deletedVideo
        } catch (error) {
            console.log(error);
        }
    }
    async convertVideoWebmToMp4(originUrlVideo: string) {
            try {
                const originUrlVideoFromLocal = path.join(__dirname+"/../../inputvideo.webm")
                const { responseVideo } = await this.createVideoDocument(originUrlVideo || originUrlVideoFromLocal)
                const { outputPath } = await videoprocesscontroller.convert(originUrlVideo || originUrlVideoFromLocal , responseVideo?._id)
                await this.setStatusFinishToVideoDocument(responseVideo?._id, outputPath)
            } catch (error) {
                throw error
            }
        }

    async createVideoDocument(originUrlVideo: string) {
            try {
                console.log("file: video.controller.ts line 38 VIDEOCONTROLLER createVideoDocument originUrlVideo", originUrlVideo)

                const [responseVideo] = await videoSources.create([{
                    urlStorage: originUrlVideo,
                    storage: originUrlVideo,
                    bucket: 'BootcampBackend',
                    typeVideo: 'webm',
                    status: 'pending'
                }])
                console.log("file: video.controller.ts ~ line 47 VIDEOCONTROLLER createVideoDocument responseVideo", responseVideo)

                const responseProcessVideo = await this.createStatusProcessVideo('init', responseVideo?._id)
                console.log("file: video.controller.ts line 50 VIDEOCONTROLLER createVideoDocument responseProcessVideo", responseProcessVideo)

                return { responseVideo, responseProcessVideo }

            } catch (error) {
                throw error
            }
        }

    async createStatusProcessVideo(status: any, videoId: any) {
            try {
                const [responseProcessVideo] = await processVideo.create([
                    {
                        status,
                        videoId
                    }
                ])
                return responseProcessVideo
            } catch (error) {
                throw error
            }
        }

    async setStatusFinishToVideoDocument(videoId: any, outputPath: string) {
            try {
                let querySearch = {
                    _id: new Types.ObjectId(videoId)
                }
                let queryUpdate = {
                    oldStatus: 'pending',
                    status: 'finished',
                    outputPath
                }
                let queryOptions = {
                    new: true
                }
                const newDocumentUpdate = await videoSources.findOneAndUpdate(querySearch, queryUpdate, queryOptions)
                console.log("🚀 ~ file: video.controller.ts ~ line 88 ~ VIDEOCONTROLLER ~ setStatusFinishToVideoDocument ~ newDocumentUpdate", newDocumentUpdate)
            } catch (error) {
                throw error
            }
        }
    }

export default new VIDEOCONTROLLER()