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

	const authors = {}
	const orgs = {}

	for(let auth of elt.findInboundOfType('author')) {
		if(auth.from.type.name != 'person') {
			orgs[auth.from.label] = auth.from
		}
		else {
			authors[auth.from.label] = auth.from
		}
	}

	for(let c of elt.findOutboundOfType('specification-of-group')) {
		orgs[c.to.label] = c
	}

	let sponsoringOrgName = elt.fields['Parent Org']
	if(sponsoringOrgName) {
		const sponsoringOrg = elt.model.locateElementByLabel(sponsoringOrgName)
		if(sponsoringOrg) {
			orgs[sponsoringOrg.label] = sponsoringOrg
			}
		}

	const a=(Object.keys(authors).sort()).join(";")
	const s=(Object.keys(orgs).sort()).join(";")
	return "Publication '"+elt.label+"' authors='"+a+"', orgs='"+s+"'"
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
				if(cat=='s') throw E
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
