import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { FilePond, File, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

registerPlugin(FilePondPluginImagePreview);
class Dashboard extends Component {
    state = {
            
        // Set initial files
        files: [],
        data: [],
        uploadstatus:"",
        downloadstatus:""
    };
    
    handleInit  = async () => {
        console.log('FilePond instance has initialised', this.state.files);
        this.setState({
            uploadstatus:"Uploading..."
        });
        const response = await fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.state.files[0].name }),
            ok:false
        });
        const success = await response.ok;
        console.log(success);
        if(success===true){
            this.setState({
                uploadstatus:"Successful"
            });
        }
        else{
            this.setState({
                uploadstatus:"Failed"
            })
        }
    }

    handleShowList = async () =>{
        const response = await fetch('/api/show');
        const body = await response.json();
        this.setState({
            data: body.filesdata
        });
        return body;
    }

    handleDeleteFile = async (i) =>{
        const response = await fetch('/api/delete',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({ name:i}),
        });
        const data = this.state.data.filter(data =>{
            return data.name !==i;
        });
        const name = await response.ok;
        
        this.setState({
            data:data
        });
        console.log(name);
    }
    handleDownloadFile = async (i) =>{
        this.setState({
            downloadstatus:"Downloading..."
        });
        const response = await fetch('/api/download',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body: JSON.stringify({name:i}),
            ok:false
        });
        const success = await response.ok;
        console.log(success);
        if(success===true){
            this.setState({
                downloadstatus:"Successful"
            });
        }
        else{
            this.setState({
                downloadstatus:"Failed"
            })
        }
    }
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col l8 m12 s12 offset-l2 dropfilesarea">
                        <h5>Upload Your files here!</h5>
                    <FilePond ref={ref => this.pond = ref}
                          allowMultiple={true}
                          maxFiles={3}
                          server="/api"
                          onaddfile={(error,file) => this.handleInit() }
                          onupdatefiles={(fileItems) => {
                              // Set current file objects to this.state
                              this.setState({
                                  files: fileItems.map(fileItem => fileItem.file)
                              });
                          }} >
                    
                    {/* Update current files  */}
                    {this.state.files.map(file => (
                        <File key={file} src={file} origin="local" />
                    ))}
                    
                </FilePond>
                <h5>File Uploaded status :{this.state.uploadstatus}</h5><br></br>
                <h5>File Downloaded status :{this.state.downloadstatus}</h5>
                    </div>                  
                    
                </div>
                <div className="row">
                <div><Link to="/" className="waves-effect waves-light btn yellow accent-4 black-text" onClick={this.handleShowList}>Show Files</Link></div> 
                    <div className="col l8 m12 s12 offset-l2">
                    <table className="striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.data.map((data,i)=>{
                                if(this.state.data.length){
                                    return(
                                    <tr key={i}>
                                        <td><h6>{data.name}</h6></td>
                                        <td>
                                            <Link to="/" onClick={this.handleDownloadFile.bind(this,data.name)} 
                                            className="waves-effect right waves-light btn blue accent-4 black-text">Download</Link></td>
                                        <td>
                                            <Link to="/" onClick={this.handleDeleteFile.bind(this,data.name)} 
                                            className="waves-effect right waves-light btn yellow accent-4 black-text">Delete</Link></td>
                                    </tr>
                                )
                                }
                                else{
                                    return(
                                        <tr>
                                            <td>NO FILES</td>
                                        </tr>
                                    )
                                }
                                
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;