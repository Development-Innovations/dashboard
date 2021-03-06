SearchResult=React.createClass({
	mixins:[ReactMeteorData],
	getMeteorData: function(){
  	handle = Meteor.subscribe("projects");
  	var data = {
  		projectsLoaded: FlowRouter.subsReady()
  	};
  	// console.log(data.projectsLoaded, "******* >>>>>", data.currentPhase)
  	if (data.projectsLoaded) {
			let phasesData = ProjectPhases.find().fetch();
			let phases =	_.indexBy(phasesData,'_id');
			/*if(data.currentPhase){
				// console.log("phase -", data.currentPhase)
				let pid=_.find(phases, function(phase) {
					// console.log("SearchResult :: phase -->>", phase)
					// console.log(this.props.currentPhase,">>>>>>>>>dsergfdg>>>>>>>>>")
					return phase.alias == data.currentPhase
				})
				// console.log("SearchResult :: pid  -->>", pid);
				filteredProjects = Projects.find({phaseId:pid._id, tags: {$in: [this.props.tag]}}).fetch();
			}else{*/
				// console.log("phase -", this.props.currentPhase)
				filteredProjects = Projects.find({tags: {$in: [this.props.tag]}}).fetch();
			// }
			return{
	  		phases: phases,
				filteredProjects: filteredProjects,
			}
		}
	},
	getItems:function(items){
		// console.log("project list :: items -->>", items)
		let itemsLength = items.length - 1;
		return (
			items.map(function(item,index){	
				return <span key={index}><a href={item.link}>{item.name}</a>{(index < itemsLength)?", ":""}</span>
			})
		)
	},
	searchData: function(tag){
		this.props.searchTag(tag);
	},
	render: function(){
		// that = this;
		// console.log("========", this)
		return (
			<div>
				{
					this.data.filteredProjects.map((project)=>{
						// console.log(">>>>>>>>>>>>>>", project)
						return(
							<div key={project._id}>
								<div className="clear"></div>
								<div className="explainer">
									<div className="about left">
										<h2>{project.title}</h2>
										<p>{project.description}</p>
										{
											project && project.tags ?
												project.tags.map((tag, index)=>{
													return <a href="javascript:void(0)" key={index} className="prj-tags" onClick={()=>this.searchData(tag)}>{tag}</a>
												})
											:''
										}
									</div>
									<div className="data left">
										<span className={"tags "+this.data.phases[project.phaseId].dashboxclass+" right"}>{this.data.phases[project.phaseId].title}</span>
										<ul>
											<li><strong>Grantee: </strong>{this.getItems(project.grantee)}</li>
											<li><strong>Partners: </strong>{this.getItems(project.partners)}</li>
											<li><strong>Technical Providers: </strong>{this.getItems(project.technical_providers)}</li>
											<li><strong>Technology Solution: </strong>{project.technology_solution}</li>
											<li><strong>Direct Beneficiaries: </strong>{project.direct_beneficiaries}</li>
										</ul>
									</div>
								</div>
							</div>
						)
					})
				}
			</div>
		);
	}
});