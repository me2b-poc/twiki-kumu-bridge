import { kumuloader,KumuElement,KumuConnection } from '../kumu'
import { tiddlyloader } from '../tiddly'
import { schemas } from '../schema'

import { Context } from '../context'
import { TiddlerBuilder, calculateSubtypeForWorkingGroup, tiddlerSlugify, createEdgeMap, configureType, populateSchema } from '../convert/create-node-tiddler'



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

	function dumpList(conns:KumuConnection[]):string {
		let msg=''
		for(let c of conns) {
			msg+="\n\t to:"+c.to.label
		}
		return msg
	}

	const conns = elt.findOutboundOfType('organization-for-group')
	let parentOrgName = elt.fields['Parent Org']
	//console.log(elt.label.padStart(60,' ')+"\t"+conns.length+"\t"+parentOrgName)

	if(!parentOrgName) {
		if(conns.length == 0)
			throw new Error("0:No parentOrg or 'organization for group' connection for " + elt.label+", of type "+elt.type.name)
		if(conns.length > 1)
			throw new Error("1:Too many 'organization for group' connections for " + elt.label+", connected to:"+dumpList(conns))
		parentOrgName=conns[0].to.label
	}

	const parentOrg = elt.model.locateElementByLabel(parentOrgName)
	if(!parentOrg) {
		throw new Error("2:Parented working group, but parent not found for elt "+elt.label+" which lists '"+parentOrgName+"' as parent")
		}

	elt.fields['SubType'] = calculateSubtypeForWorkingGroup(elt,parentOrg)

	return "Working Group '"+elt.label+"' is '"+elt.fields['SubType']+"' (parent is:"+parentOrg.label+")"
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
		if(elt.type.name=='working-group')
			try {
				msgs.push(analyzeElement(elt,ctx))
			}
			catch(E) {
				let cat = E.message.substring(0,1)
				const msg = E.message.substring(2)
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
