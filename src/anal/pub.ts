import { kumuloader,KumuElement,KumuConnection } from '../kumu'
import { tiddlyloader } from '../tiddly'
import { schemas } from '../schema'

import { Context } from '../context'
import { TiddlerBuilder, tiddlerSlugify, createEdgeMap, configureType, populateSchema } from '../convert/create-node-tiddler'



function analyzeElement(elt:KumuElement,ctx:Context)
{
	const tb = {
		fields:{},
		body:''
	} as TiddlerBuilder

	createEdgeMap(elt,tb)
	configureType(elt,tb)

	/*
	for(let x in tb.schema.properties) {
		const sdef = tb.schema.properties[x]
		const key = tiddlerSlugify(x)
		const mapper = tb.inbound[x]
		const value = mapper(elt,sdef)
		//console.log("Setting:",key,value)
		tb.fields[key]=value
	}
	*/

	function dumpOList(conns:KumuConnection[]):string {
		let msg=''
		for(let c of conns) {
			msg+="\n\t to:"+c.to.label+", "+JSON.stringify(c.fields)
		}
		return msg
	}
	function dumpIList(conns:KumuConnection[]):string {
		let msg=''
		for(let c of conns) {
			msg+="\n\t from:"+c.from.label+", "+JSON.stringify(c.fields)
		}
		return msg
	}

	let conns = elt.findOutboundOfType('specification-of-group')
	let parentOrgName = elt.fields['Parent Org']
	//console.log(elt.label.padStart(60,' ')+"\t"+conns.length+"\t"+parentOrgName)

	if(conns.length > 1)
		throw new Error("0:Too many 'specification-of-group' connections for " + elt.label+", connected to:"+dumpOList(conns))

	if(conns.length == 0) {
		let conns = elt.findInboundOfType('author')
		if(conns.length > 1)
			throw new Error("1:Too many 'author' connections for " + elt.label+", connected to:"+dumpIList(conns))
		if(conns.length == 0)
			throw new Error("2:Failed to find 'specification-of-group' or 'author' connection for " + elt.label)
		if(!parentOrgName)
			parentOrgName=conns[0].from.label

		}
	else {
		if(!parentOrgName)
			parentOrgName=conns[0].to.label
	}


	const parentOrg = elt.model.locateElementByLabel(parentOrgName)
	if(!parentOrg) {
		throw new Error("3:Parented publication, but parent not found for elt "+elt.label)
		}

	const pType = parentOrg.fields['SubType']
	if(!pType) {
		throw new Error("3:Parented publication, but parent has no subtype, elt is "+elt.label+", parent is "+parentOrg.label+", with type "+parentOrg.type.name+" and subtype "+pType)
	}

	return "Publication '"+elt.label+"' is 'w/in a "+parentOrg.fields['SubType']+"' (parent is:"+parentOrg.label+")"
}

async function analyze(eltfile:string,connfile:string,filebase:string) {

	console.log("Load Kumu");
	const model = await kumuloader(eltfile,connfile)

	console.log("Load Tiddly");
	const tiddly = await tiddlyloader(filebase)

	const ctx:Context = { model,tiddly,schemas }

	console.log("Analyzing Kumu Element -> Tiddler Projection");
	//const nodes:NodeTiddler[] = []
	const errs:any= {
		'0':[],
		'1':[],
		'2':[],
		'3':[],
		'other':[]
	}
	const msgs = [] as string[]
	for(let slug in model.elements) {
		const elt = model.elements[slug]
		if(elt.type.name=='publication')
			try {
				msgs.push(analyzeElement(elt,ctx))
			}
			catch(E) {
				let cat = E.message.substring(0,1)
				const msg = E.message.substring(2)
				if(cat=='C') throw E
				if(!errs[cat]) cat='other'
				errs[cat].push(msg)
			}
	}
	for(let index in errs) {
		const msgs=errs[index]
		console.log("Error code:",index)
		for(let msg of msgs) {
			console.log(msg)
		}
	}
	console.log("Success:")
	for(let msg of msgs) {
		console.log(msg);
	}

}

export = (args:string[]) => {

	console.log("start, args=",args);
	analyze('elements.json','connections.json','output').then(()=>{
		console.log("done");
	})
}
