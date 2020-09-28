import React, { useState } from 'react'
import { uploadImage } from './index'
import { Request } from '@gm-common/x-request'
import { Uploader } from '@gm-pc/react'


enum ImageType {
  IMAGE_TYPE_UNSPECIFIED = 0,
  IMAGE_TYPE_MERCHANDISE_CATEGORY_DEFAULT = 10, // 分类图片
  IMAGE_TYPE_MERCHANDISE_SKU = 11,
  IMAGE_TYPE_MERCHANDISE_SSU = 12,
  IMAGE_TYPE_ENTERPRISE_LOGO = 20,
}

interface GetQiniuUploadTokenResponse {
  upload_token: string;
  dir_path: string; // 文件上传的目录路径，比如说 "/group_123/10/"
  expire_time: string; // token 过期时间的 UNIX MilliSecond 时间戳
}
const getQiniuSSUToken = () => {
  return Request<GetQiniuUploadTokenResponse>('/secret/GetQiniuUploadToken', { headers: {
    authorization: '6dd24a47dd6b444f941cc86adc8e80df'
  }}).data({ file_type: ImageType.IMAGE_TYPE_MERCHANDISE_SSU }).run().then(json => {
    const { expire_time, dir_path, upload_token } = json.response
    return {
      prefix: dir_path,
      token: upload_token,
      expire_time: `${new Date(+new Date() + +expire_time)}`
    }
  })
}

const uploadQiniuImage = (file: File) => {
  return uploadImage(file, {
    fileType: `IMAGE_TYPE_MERCHANDISE_SSU`,
    getQiniuInfo: getQiniuSSUToken,
  }).then(({ url, key }) => ({
    data: {
      url,
      id: `${key}`,
    },
  }))
}

export const normal = () => {
  const [url, setUrl] = useState<string>()
  function handleUpload(files: File[]) {
    uploadQiniuImage(files[0]).then(({ data: { url, id } }) => {
      console.log(url, id)
      setUrl(url)
    })
  }

  return (
    <div>
      <Uploader
        onUpload={handleUpload}
        accept='image/*'
      />
      {url && <img src={url} width={200} alt=""/>}
    </div>
  )
}

export default {
  title: 'Image/default',
}

