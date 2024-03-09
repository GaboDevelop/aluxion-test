
import * as path from 'path'

export const getMimeType = (ext: string) => {
    switch (ext) {
      case '.jpg':
        return 'image/jpeg';
      case '.jpeg':
        return 'image/jpeg';
      case '.png':
        return 'image/png';
      case '.pdf':
        return 'application/pdf';
      case '.doc':
        return 'application/msword';
      case '.docx':
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      case '.xls':
        return 'application/vnd.ms-excel';
      case '.xlsx':
        return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      case '.ppt':
        return 'application/vnd.ms-powerpoint';
      case '.pptx':
        return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      default:
        return 'application/octet-stream';
    }
}

export const getFileNameAndMime = (url: string) => {
    const parsedPath = path.parse(url);
    //extention to mimetype
    const mimetype = getMimeType(parsedPath.ext);
    return {
      name: parsedPath.name,
      mimetype: mimetype
    };
  }