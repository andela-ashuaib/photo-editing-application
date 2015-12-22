import React from 'react';

export default class SearchableImage extends React.Component{
    constructor(){
        super();

        this.state = {filterText : ''};
    }
    handleUserInput(filterText){
        this.setState({filterText: filterText});
    }
    render(){
        return (
            <div>

                <SearchBar filterText={this.state.filterText}
                onUserInput={this.handleUserInput.bind(this)} 
                />

                <UploadDiv data={this.props.data}
                filterText={this.state.filterText} 
                />
            </div>

            );
    }
}

class SearchBar extends React.Component{

    handleChange(){
            this.props.onUserInput(
            this.refs.filterTextInput.getDOMNode().value
        )

    }

    render(){
        return (
            <form className="form-inline">
              <div className="form-group">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Search"
                    placeholder="Search for one keyword..." 
                    ref="filterTextInput"
                    value= {this.props.filterText}
                    onChange= {this.handleChange.bind(this)} 
                    />
                  <div className="input-group-addon"><i className="mdi mdi-magnify"></i></div>
                </div>
              </div>
            </form>




            );
    }

}

class UploadDiv extends React.Component{

    render(){
        let sections = [];
        let data = this.props.data;
        data.forEach(function(image){
            if(image.title.indexOf(this.props.filterText) == -1) return;

            sections.push(<SectionDiv image={image} />);
        }.bind(this));

        return(
            <div className="upload-div">{sections}
            <button className="btn btn-primary"><i className="mdi mdi-upload"></i> Upload </button>
            </div>
            );

        
    }
}

class SectionDiv extends React.Component{

    render(){
        return(
                <div className="uploaded">
                <div className="media">
                    <a className="media-left" href="#">
                    <img className="media-object" src={this.props.image.src} alt="Generic placeholder image" />
                    </a>
                    <div className="media-body">
                        <p className="media-heading">{this.props.image.title}
                            <br/>
                            <small> Uploaded on </small>
                        </p>
                    </div>
                </div>
            </div>)


    }
}