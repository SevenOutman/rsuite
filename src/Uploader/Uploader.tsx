import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import compose from 'recompose/compose';

import IntlContext from '../IntlProvider/IntlContext';
import withLocale from '../IntlProvider/withLocale';
import FileItem from './UploadFileItem';
import UploadTrigger from './UploadTrigger';
import { prefix, ajaxUpload, defaultProps, getUnhandledProps } from '../utils';
import { getFiles, guid } from './utils';
import { StandardProps } from '../@types/common';
import { FileType } from './typings';

type FileStatusType = 'inited' | 'uploading' | 'error' | 'finished';
interface FileProgressType {
  status?: FileStatusType;
  progress?: number;
}

export interface UploaderProps extends StandardProps {
  /** Uploading URL */
  action?: string;

  /** File types that can be accepted. See input accept Attribute */
  accept?: string;

  /** Automatically upload files after selecting them */
  autoUpload?: boolean;

  /** Primary content */
  children?: React.ReactNode;

  /** List of uploaded files */
  defaultFileList?: FileType[];

  /** List of uploaded files （Controlled） */
  fileList?: FileType[];

  /** Upload the parameters with */
  data?: object;

  /** Allow multiple file uploads to be selected at a time */

  multiple?: boolean;

  /** Disabled upload button */
  disabled?: boolean;

  /** Disabled file item */
  disabledFileItem?: boolean;

  /** Upload the parameter name of the corresponding file */
  name?: string;

  /** Set upload timeout */
  timeout?: number;

  /** Whether to carry cookies when uploading requests */
  withCredentials?: boolean;

  /** Set Upload request Header */
  headers?: object;

  /** Upload list Style */
  listType?: 'text' | 'picture-text' | 'picture';

  /** Allow the queue to be updated. After you select a file, update the checksum function before the upload file queue, and return false to not update */
  shouldQueueUpdate?: (fileList: FileType[], newFile: FileType[] | FileType) => boolean;

  /** Allow uploading of files. Check function before file upload, return false without uploading  */
  shouldUpload?: (file: FileType) => boolean;

  /** callback function that the upload queue has changed */
  onChange?: (fileList: FileType[]) => void;

  /** The callback function that starts the upload file */
  onUpload?: (file: FileType) => void;

  /** In the file list, for uploading failed files, click the callback function to upload */
  onReupload?: (file: FileType) => void;

  /** In the file list, click the callback function for the uploaded file */
  onPreview?: (file: FileType, event: React.SyntheticEvent<any>) => void;

  /** Upload callback function with erro */
  onError?: (
    status: object,
    file: FileType,
    event: React.SyntheticEvent<any>,
    xhr: XMLHttpRequest
  ) => void;

  /** callback function after successful upload */
  onSuccess?: (
    response: object,
    file: FileType,
    event: React.SyntheticEvent<any>,
    xhr: XMLHttpRequest
  ) => void;

  /** Callback functions that upload progress change */
  onProgress?: (
    percent: number,
    file: FileType,
    event: React.SyntheticEvent<any>,
    xhr: XMLHttpRequest
  ) => void;

  /** In the file list, click the callback function to delete a file */
  onRemove?: (file: FileType) => void;

  /** Max file size limit of the preview file */
  maxPreviewFileSize?: number;

  /** You can use a custom element for this component */
  toggleComponentClass?: React.ElementType;

  /** Custom render file information */
  renderFileInfo?: (file: FileType, fileElement: React.ReactNode) => React.ReactNode;

  /** Removable list file  */
  removable?: boolean;

  /** File list can be rendered */
  fileListVisible?: boolean;

  /** Supported Drag and drop upload **/
  draggable?: boolean;
}

interface UploaderState {
  fileList: FileType[];
  fileMap: { [fileKey: string]: FileProgressType };
}

class Uploader extends React.Component<UploaderProps, UploaderState> {
  static propTypes = {
    action: PropTypes.string,
    accept: PropTypes.string,
    autoUpload: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    defaultFileList: PropTypes.array,
    fileList: PropTypes.array,
    data: PropTypes.object,
    multiple: PropTypes.bool,
    disabled: PropTypes.bool,
    disabledFileItem: PropTypes.bool,
    name: PropTypes.string,
    timeout: PropTypes.number,
    withCredentials: PropTypes.bool,
    headers: PropTypes.object,
    locale: PropTypes.object,
    listType: PropTypes.oneOf(['text', 'picture-text', 'picture']),
    shouldQueueUpdate: PropTypes.func,
    shouldUpload: PropTypes.func,
    onChange: PropTypes.func,
    onUpload: PropTypes.func,
    onReupload: PropTypes.func,
    onPreview: PropTypes.func,
    onError: PropTypes.func,
    onSuccess: PropTypes.func,
    onProgress: PropTypes.func,
    onRemove: PropTypes.func,
    maxPreviewFileSize: PropTypes.number,
    style: PropTypes.object,
    toggleComponentClass: PropTypes.elementType,
    renderFileInfo: PropTypes.func,
    removable: PropTypes.bool,
    fileListVisible: PropTypes.bool,
    draggable: PropTypes.bool
  };
  static defaultProps = {
    autoUpload: true,
    timeout: 0,
    name: 'file',
    multiple: false,
    disabled: false,
    withCredentials: false,
    data: {},
    listType: 'text',
    removable: true,
    fileListVisible: true
  };

  inputRef: React.RefObject<any>;

  constructor(props) {
    super(props);
    const { defaultFileList = [] } = props;
    const fileList = defaultFileList.map(this.createFile);

    this.state = {
      fileList,
      fileMap: {}
    };
    this.inputRef = React.createRef();
  }

  // public API
  start(file?: FileType) {
    if (file) {
      this.handleUploadFile(file);
      return;
    }
    this.handleAjaxUpload();
  }

  getFileList(): FileType[] {
    const { fileList } = this.props;
    const { fileMap } = this.state;

    if (typeof fileList !== 'undefined') {
      return fileList.map(file => {
        return {
          ...file,
          ...fileMap[file.fileKey]
        };
      });
    }

    return this.state.fileList;
  }

  cleanInputValue() {
    if (this.inputRef.current) {
      this.inputRef.current.getInputInstance().value = '';
    }
  }

  handleRemoveFile = (fileKey: number | string) => {
    const fileList = this.getFileList();
    const file: any = _.find(fileList, f => f.fileKey === fileKey);
    const nextFileList = fileList.filter(f => f.fileKey !== fileKey);

    if (this.xhrs[file.fileKey] && this.xhrs[file.fileKey].readyState !== 4) {
      this.xhrs[file.fileKey].abort();
    }

    this.setState({ fileList: nextFileList });

    this.props.onRemove?.(file);
    this.props.onChange?.(nextFileList);
  };

  handleUploadTriggerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { autoUpload, shouldQueueUpdate } = this.props;
    const fileList = this.getFileList();
    const files: File[] = getFiles(event);
    const newFileList: FileType[] = [];

    Array.from(files).forEach((file: File) => {
      newFileList.push({
        blobFile: file,
        name: file.name,
        status: 'inited',
        fileKey: guid()
      });
    });

    const nextFileList = [...fileList, ...newFileList];

    if (shouldQueueUpdate?.(nextFileList, newFileList) === false) {
      this.cleanInputValue();
      return;
    }

    this.props.onChange?.(nextFileList);
    this.setState({ fileList: nextFileList }, () => {
      autoUpload && this.handleAjaxUpload();
    });
  };

  handleAjaxUpload() {
    const { shouldUpload } = this.props;
    const fileList = this.getFileList();
    fileList.forEach(file => {
      if (shouldUpload?.(file) === false) {
        return;
      }

      if (file.status === 'inited') {
        this.handleUploadFile(file);
      }
    });

    this.cleanInputValue();
  }

  handleAjaxUploadSuccess = (
    file: FileType,
    response: object,
    event: React.SyntheticEvent<any>,
    xhr: XMLHttpRequest
  ) => {
    const nextFile: FileType = {
      ...file,
      status: 'finished',
      progress: 100
    };
    this.updateFileList(nextFile, () => {
      this.props.onSuccess?.(response, nextFile, event, xhr);
    });
  };

  handleAjaxUploadError = (
    file: FileType,
    status: object,
    event: React.SyntheticEvent<any>,
    xhr: XMLHttpRequest
  ) => {
    const nextFile: FileType = {
      ...file,
      status: 'error'
    };
    this.updateFileList(nextFile, () => {
      this.props.onError?.(status, nextFile, event, xhr);
    });
  };

  handleAjaxUploadProgress = (
    file: FileType,
    percent: number,
    event: React.SyntheticEvent<any>,
    xhr: XMLHttpRequest
  ) => {
    const nextFile: FileType = {
      ...file,
      status: 'uploading',
      progress: percent
    };

    this.updateFileList(nextFile, () => {
      this.props.onProgress?.(percent, nextFile, event, xhr);
    });
  };

  handleUploadFile = (file: FileType) => {
    const { name, action, headers, withCredentials, timeout, data, onUpload } = this.props;
    const xhr = ajaxUpload({
      name,
      timeout,
      headers,
      data,
      withCredentials,
      file: file.blobFile,
      url: action,
      onError: this.handleAjaxUploadError.bind(this, file),
      onSuccess: this.handleAjaxUploadSuccess.bind(this, file),
      onProgress: this.handleAjaxUploadProgress.bind(this, file)
    });

    this.updateFileList({
      ...file,
      status: 'uploading'
    });
    this.xhrs[file.fileKey] = xhr;
    onUpload?.(file);
  };

  handleReupload = (file: FileType) => {
    const { onReupload, autoUpload } = this.props;
    autoUpload && this.handleUploadFile(file);
    onReupload?.(file);
  };

  updateFileList(nextFile: FileType, callback?: () => void) {
    const fileList = this.getFileList();
    const nextFileList = fileList.map(file => {
      return file.fileKey === nextFile.fileKey ? nextFile : file;
    });

    const nextState: any = {
      fileList: nextFileList
    };

    if (nextFile.progress) {
      const { fileMap } = this.state;

      fileMap[nextFile.fileKey] = {
        progress: nextFile.progress,
        status: nextFile.status
      };

      nextState.fileMap = fileMap;
    }

    this.setState(nextState, callback);
  }
  createFile = (file: FileType) => {
    const { fileKey } = file;
    return {
      ...file,
      fileKey: fileKey || guid(),
      progress: 0
    };
  };

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  progressTimer: any; //IntervalID;
  xhrs = {};
  uploadTrigger = null;

  renderFileItems() {
    const {
      disabledFileItem,
      listType,
      onPreview,
      maxPreviewFileSize,
      renderFileInfo,
      removable
    } = this.props;
    const fileList = this.getFileList();

    return (
      <div key="items" className={this.addPrefix('file-items')}>
        {fileList.map((file, index) => (
          <FileItem
            key={file.fileKey || index}
            file={file}
            maxPreviewFileSize={maxPreviewFileSize}
            listType={listType}
            disabled={disabledFileItem}
            onPreview={onPreview}
            onReupload={this.handleReupload}
            onCancel={this.handleRemoveFile}
            renderFileInfo={renderFileInfo}
            removable={removable}
          />
        ))}
      </div>
    );
  }

  renderUploadTrigger() {
    const {
      name,
      multiple,
      disabled,
      accept,
      children,
      toggleComponentClass,
      draggable,
      ...rest
    } = this.props;
    const unhandled = getUnhandledProps(Uploader, rest);
    return (
      <UploadTrigger
        {...unhandled}
        name={name}
        key="trigger"
        multiple={multiple}
        draggable={draggable}
        disabled={disabled}
        accept={accept}
        ref={this.inputRef}
        onChange={this.handleUploadTriggerChange}
        componentClass={toggleComponentClass}
      >
        {children}
      </UploadTrigger>
    );
  }

  render() {
    const {
      classPrefix,
      className,
      listType,
      fileListVisible,
      locale,
      style,
      draggable
    } = this.props;
    const classes = classNames(className, classPrefix, this.addPrefix(listType), {
      [this.addPrefix('draggable')]: draggable
    });
    const renderList = [this.renderUploadTrigger()];

    if (fileListVisible) {
      renderList.push(this.renderFileItems());
    }

    if (listType === 'picture') {
      renderList.reverse();
    }

    return (
      <IntlContext.Provider value={locale}>
        <div className={classes} style={style}>
          {renderList}
        </div>
      </IntlContext.Provider>
    );
  }
}

export default compose<UploaderProps, UploaderProps>(
  withLocale<UploaderProps>(['Uploader']),
  defaultProps<UploaderProps>({
    classPrefix: 'uploader'
  })
)(Uploader);
