import fs from 'fs-extra'
import uuid from 'uuid'
import slugify from 'slugify'
import path from 'path'

export type tiddlydate = string;

export const TIDDLERTYPE="text/vnd.tiddlywiki"

// everything seems to have a GUID
export interface TiddlyElement {
	guid:string
	base:TiddlerFileBase
}

// Tiddly
export interface Tiddler extends TiddlyElement {
	created: tiddlydate
	modified: tiddlydate
	title:string
	type:string

	tiddlerdir:() => string
	tiddlerfile:() => string
	tiddlerdata:() => string
}

export interface TiddlerData {
	created?: tiddlydate
	modified?: tiddlydate
	title?:string
	type?:string
	guid?:string
	fields?:Map<string,string>
	text?:string
}

export interface TiddlyMap {
	name:string
	nodes:Set<string>
	edges:Set<string>
}

export interface TiddlerFileBase {
	path:string
	nodes:string
	mapViews:string
	mapEdgeTypes:string
	mapNodeTypes:string
	system:string
	templates:string
	createNodeTiddler:(data:TiddlerData) => NodeTiddler
	createEdgeTypeTiddler:(parts:string[]) => EdgeTypeTiddler
	createNodeTypeTiddler:(parts:string[]) => NodeTypeTiddler
	ensurePath:(base:string,dir?:string) => string
}



export interface NodeTiddler extends TiddlyElement, Tiddler {
	tmap_id:string
	tmap_edges: string
	element_type:string
	wiki_text:string
	fields:Map<string,string>
}

// --------------------------------------------------------------------------
// Impelementation
export class SimpleTiddlyElement implements TiddlyElement {
	guid:string
	base:TiddlerFileBase
	constructor(base:TiddlerFileBase) {
		this.guid = uuid.v4()
		this.base = base
	}
}

export class SimpleTiddler extends SimpleTiddlyElement implements Tiddler
{
	created: tiddlydate
	modified: tiddlydate
	title:string
	type:string

	constructor(data:TiddlerData,base:TiddlerFileBase) {
		super(base)
		this.title = data.title || "untitled"
		this.created = data.created || ''
		this.modified = data.modified || ''
		this.type = data.type || TIDDLERTYPE
		this.guid = data.guid || this.guid
	}

	tiddlerdir():string {
		return this.base.path
	}
	tiddlerfile():string {
		const filepart = slugify(this.title) + ".tid"
		return path.join(this.tiddlerdir(),filepart)
	}
	tiddlerdata():string {
		return ""+
			"created:" + this.created + "\n" +
			"modified:" + this.modified + "\n" +
			"title:" + this.title + "\n" +
			"type:" + this.type + "\n";
	}
}

export class SimpleNodeTiddler extends SimpleTiddler implements NodeTiddler
{
	tmap_id:string
	tmap_edges: string
	element_type:string
	wiki_text:string
	fields:Map<string,string>

	sorted_keys:string[]
	constructor(data:TiddlerData,base:TiddlerFileBase) {
		super(data,base)
		this.fields = data.fields || new Map<string,string>()
		this.tmap_id = this.fields['tmap.id'] || ''
		this.tmap_edges = this.fields['tmap.edges'] || ''
		this.element_type = this.fields['element.type'] || undefined
		this.wiki_text = data.text || ""
		this.sorted_keys = []
		for(let k in this.fields)
			this.sorted_keys.push(k)
		this.sorted_keys.sort()
	}

	tiddlerdir():string {
		const typepart = this.fields['element.type']
		if(!typepart)
			return this.base.nodes
		else
			return path.join(this.base.nodes,typepart)
	}

	tiddlerdata() {
		let field_data = ""
		for (let k of this.sorted_keys) {
			field_data = field_data + k + ":" + this.fields[k] + "\n"
		}
		return super.tiddlerdata() + field_data + "\n" + this.wiki_text
	}
}


export class NodeTypeTiddler extends SimpleTiddler  {
	/*
	created: 20190902112311677
	modified: 20190902112605892
	priority: 1
	scope: [field:element.type[working-group]]
	style: {"color":{"border":"rgba(146,233,110,1)","background":"rgba(252,53,129,1)"}}
	title: $:/plugins/felixhayashi/tiddlymap/graph/nodeTypes/working-group
	type: text/vnd.tiddlywiki
*/
	parts:string[]
	slugchain:string[]
	filepart:string
	dirchain?:string[]

	scope:string
	style:string
	constructor(parts:string[],base:TiddlerFileBase) {
		super({
			title:"$:/plugins/felixhayashi/tiddlymap/graph/nodeTypes/"+parts.join("/")
		},base)
		this.parts = parts
		this.slugchain=[]
		const len = this.parts.length
		for(let idx in parts)
			this.slugchain[idx]=slugify(parts[idx])
		if (len == 1) {
			this.filepart = this.slugchain[0]
			this.dirchain = undefined
		}
		else {
			this.filepart = this.slugchain[len-1]
			this.dirchain=this.slugchain.slice(0,len-1)
			}

		this.scope='[field:element.type['+this.filepart+']]'
		this.style='{"color":{"border":"'+this.randomRGBA()+'","background":"'+this.randomRGBA()+'"}}'
	}

	tiddlerdata():string {
		return super.tiddlerdata() +
		"scope: "+this.scope+"\n"+
		"style: "+this.style+"\n";
	}

	randomRGBA():string {
		return 'rgba('
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+')'
	}

	tiddlerdir():string {
		if(this.dirchain)
			return path.join(this.base.mapNodeTypes,this.dirchain.join("/"))
		else
			return this.base.mapNodeTypes;
	}

	tiddlerfile():string {
		return path.join(this.tiddlerdir(),this.filepart + ".tid")
	}

}

export class EdgeTypeTiddler extends SimpleTiddler  {
	parts:string[]
	slugchain:string[]
	filepart:string
	dirchain?:string[]

	style:string
	constructor(parts:string[],base:TiddlerFileBase) {
		super({
			title:"$:/plugins/felixhayashi/tiddlymap/graph/edgeTypes/"+parts.join("/")
		},base)
		this.parts = parts
		this.slugchain=[]
		const len = this.parts.length
		for(let idx in parts)
			this.slugchain[idx]=slugify(parts[idx])
		if (len == 1) {
			this.filepart = this.slugchain[0]
			this.dirchain = undefined
		}
		else {
			this.filepart = this.slugchain[len-1]
			this.dirchain=this.slugchain.slice(0,len-1)
			}

		this.style='{"color":{"color":"'+this.randomRGBA()+'"},"width":'+Math.round(1+15*Math.random())+'}'

	}

	tiddlerdata():string {
		return super.tiddlerdata() +
		"style: "+this.style+"\n";
	}

	randomRGBA():string {
		return 'rgba('
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+','
							+Math.round(256*Math.random())+')'
	}

	tiddlerdir():string {
		if(this.dirchain)
			return path.join(this.base.mapEdgeTypes,this.dirchain.join("/"))
		else
			return this.base.mapEdgeTypes;
	}

	tiddlerfile():string {
		return path.join(this.tiddlerdir(),this.filepart + ".tid")
	}

}

export class SimpleTiddlyMap implements TiddlyMap {
	name:string
	nodes:Set<string>
	edges:Set<string>
	constructor(name:string) {
		this.name = name
		this.nodes = new Set<string>()
		this.edges = new Set<string>()
	}
}

export class TiddlerViewFiles extends SimpleTiddlyElement {
	name:string
	viewbase:string
	tiddler:string
	edges:string
	nodes:string
	layout:string

	edgeFilter:string
	nodeFilter:string
	layoutData:string
	constructor(def:TiddlyMap,base:TiddlerFileBase) {
		super(base)
		this.name = def.name
		this.viewbase = base.ensurePath(base.mapViews,def.name)
		this.tiddler = path.join(this.viewbase,"tiddler.tid")
		this.edges = path.join(this.viewbase,"edges.tid")
		this.nodes = path.join(this.viewbase,"nodes.tid")
		this.layout = path.join(this.viewbase,"layout.tid")

		this.edgeFilter = ''
		for(let e in def.edges) {
			//this.edgeFilter += "[field:tmap.id["+e+"]] "
		}
		this.nodeFilter = ''
		let idx = 0.0
		const radius = 3000
		const ld:any = {}
		def.nodes.forEach((val:string) => {
			this.nodeFilter += "[field:tmap.id["+val+"]] "
			ld[val] = {x:radius*Math.sin(idx),y:radius*Math.cos(idx)}
			idx = idx + (3*Math.random())
		})
		this.layoutData = JSON.stringify(ld,null,3)
	}

	tiddlerdata():string {
		return ""+
			"id:" + this.guid + "\n" +
			"isview:" + true + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "\n" +
			"\n";
	}
	edgedata():string {
		return ""+
			"filter:" + this.edgeFilter + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/filter/edges\n" +
			"\n";
	}
	nodedata():string {
		return ""+
			"type: text/vnd.tiddlywiki" + "\n" +
			"filter:" + this.nodeFilter + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/filter/nodes\n" +
			"\n";
	}
	layoutdata():string {
		return ""+
			"type: text/vnd.tiddlywiki" + "\n" +
			"title: $:/plugins/felixhayashi/tiddlymap/graph/views/" + this.name + "/map\n" +
			"\n" + this.layoutData + "\n";
	}

}

// --------------------------------------------------------------------------
export class SimpleTiddlerFileBase implements TiddlerFileBase {
	path:string
	system:string
	templates:string
	nodes:string
	mapViews:string
	mapEdgeTypes:string
	mapNodeTypes:string

	ensurePath(base:string,dir?:string):string {
		// make sure this exists
		let path = base;
		if (dir)
			path = base + "/" + dir
		fs.ensureDirSync(path)
		return path
	}

	constructor(path:string) {
		this.path = this.ensurePath(path)
		this.nodes = this.ensurePath(path,"nodes")
		this.system = this.ensurePath(path,"system")
		this.templates = this.ensurePath(path,"templates")
		const mapsDir=this.ensurePath(path,"maps")
		this.mapViews = this.ensurePath(mapsDir,"views")
		this.mapEdgeTypes = this.ensurePath(mapsDir,"edgeTypes")
		this.mapNodeTypes = this.ensurePath(mapsDir,"nodeTypes")
	}

	createNodeTiddler(data:TiddlerData):NodeTiddler {
		const result = new SimpleNodeTiddler(data,this)
		//console.log("Node Tiddler:",result.tiddlerfile())
		return result
	}
	createEdgeTypeTiddler(parts:string[]):EdgeTypeTiddler {
		const result = new EdgeTypeTiddler(parts,this)
		return result
	}
	createNodeTypeTiddler(parts:string[]):NodeTypeTiddler {
		const result = new NodeTypeTiddler(parts,this)
		return result
	}

}

// --------------------------------------------------------------------------
export function tiddlyloader(dir:string):TiddlerFileBase
{
	const base = new SimpleTiddlerFileBase(dir)
	return base
}
