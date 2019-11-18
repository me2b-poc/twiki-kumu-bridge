import { kumuloader,KumuElement,KumuConnection } from '../kumu'
import { tiddlyloader } from '../tiddly'
import { schemas } from '../schema'

import { Context } from '../context'
import { TiddlerBuilder, tiddlerSlugify, createEdgeMap, configureType, populateSchema } from '../convert/create-node-tiddler'



function analyzeElement(elt:KumuElement,ctx:Context)
{
	const tb = {
		fields:{},
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

	function dumpList(conns:KumuConnection[]):string {
		let msg=''
		for(let c of conns) {
			msg+="\n\t to:"+c.to.label
		}
		return msg
	}

	const conns = elt.findOutboundOfType('specification-of-group')
	let parentOrgName = elt.fields['Parent Org']
	//console.log(elt.label.padStart(60,' ')+"\t"+conns.length+"\t"+parentOrgName)

	if(conns.length == 0)
		throw new Error("0:Failed to find 'specification-of-group' connection for " + elt.label)
	if(conns.length > 1)
		throw new Error("1:Too many 'specification-of-group' connections for " + elt.label+", connected to:"+dumpList(conns))

	if(!parentOrgName)
		parentOrgName=conns[0].to.label

	const parentOrg = elt.model.locateElementByLabel(parentOrgName)
	if(!parentOrg) {
		throw new Error("2:Parented spec, but parent not found for elt "+elt.label)
		}

	const pType = parentOrg.fields['SubType']
	if(!pType) {
		throw new Error("3:Parented publication, but parent has no type, elt is "+elt.label+", parent is "+parentOrg.label)
	}

	return "Publication '"+elt.label+"' is 'w/in a "+parentOrg.fields['SubType']+"' (parent is:"+parentOrg.label+")"
}

import { kumu_slugify } from '../kumu'

function dumpElt(elt:KumuElement) {
	console.log("Found",elt.label)
	console.log(" Type:"+elt.type.name)
	console.log(" SubType:"+elt.fields['SubType'])
	console.log(" Raw Fields:")
	for(let key of Object.keys(elt.fields).sort()) {
		const value = elt.fields[key]
		console.log("  -"+key+"\t=",value)
	}
	console.log(" Inbound:");
	for(let key of Object.keys(elt.inbound).sort()) {
		const conn=elt.inbound[key]
		console.log("  ",conn.type.name,conn.from.label,JSON.stringify(conn.fields));
	}
	console.log(" Outbound:");
	for(let key of Object.keys(elt.outbound).sort()) {
		const conn=elt.outbound[key]
		console.log("  ",conn.type.name,conn.to.label,JSON.stringify(conn.fields));
	}
	console.log("Description:\n"+elt.description)
}
function dumpEltSummary(summary:any) {
	for(let key of Object.keys(summary).sort()) {
		console.log("Type:",key)
		const smap = summary[key]
		for(let stype of Object.keys(smap).sort()) {
			console.log("  Subtype:",stype)
			for(let elt of smap[stype]) {
				console.log("    "+elt.label)
			}
		}
	}
}
async function lookup(eltfile:string,connfile:string,filebase:string,term:string) {

	const model = await kumuloader(eltfile,connfile)
	const tiddly = await tiddlyloader(filebase)

	const ctx:Context = { model,tiddly,schemas }

	console.log("Looking up",term);
	const termSlug = kumu_slugify(term)

	let elt = model.elements[termSlug]
	if(elt) {
		return dumpElt(elt)
	}

	const summary = {}
	let count = 0
	for(let testSlug in model.elements) {
		if(testSlug.includes(termSlug)) {
			elt = model.elements[testSlug]
			if(!summary[elt.type.name])
				summary[elt.type.name]={}
			const smap = summary[elt.type.name]
			if(!smap[elt.fields['SubType']])
				smap[elt.fields['SubType']]=[]
			smap[elt.fields['SubType']].push(elt)
			count = count + 1
			}
	}
	if(count>0) {
		if(count==1)
			return dumpElt(elt)
		else {
			console.log("Found",count,"results")
	  	return dumpEltSummary(summary)
		}
	}


	console.log("Did not find anything for '"+term+"'")
}

export = (args:string[]) => {

	if(args.length == 0) {
		console.log("usage: lookup <term>")
	}
	else {
		const term = args.join(" ")
		console.log("start, args=",args);
		lookup('elements.json','connections.json','output',term).then(()=>{
			//console.log("done");
		})
	}
}
