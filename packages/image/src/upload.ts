import { qiniuUpload } from '@gm-common/qiniup'
import type { Options } from '@gm-common/qiniup'

export async function uploadImage(blob: File, opts: Options) {
  if (!blob.type.startsWith('image/')) {
    throw new Error('this file is not image!')
  }

  return qiniuUpload(blob, opts)
}
