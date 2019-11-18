import fs from 'fs-extra'
import { kumuloader,KumuElement,KumuConnection,kumu_slugify } from '../kumu'
import { tiddlyloader } from '../tiddly'
import { schemas } from '../schema'

import { Context } from '../context'
import { TiddlerBuilder, calculateSubtypeForWorkingGroup, tiddlerSlugify, createEdgeMap, configureType, populateSchema } from '../convert/create-node-tiddler'



function writeElement(elt:KumuElement,ctx:Context)
{
	const tb = {
		fields:{},
	} as TiddlerBuilder

	createEdgeMap(elt,tb)
	configureType(elt,tb)


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

	console.log(elt.label+","+parentOrg.label+",Working Group,"+elt.fields['SubType'])
}

async function analyze(eltfile:string,connfile:string,filebase:string,match:string[]) {

	const model = await kumuloader(eltfile,connfile)

	const tiddly = await tiddlyloader(filebase)

	const ctx:Context = { model,tiddly,schemas }

	const msgs = [] as string[]
	for(let mtag of match) {
		const slug = kumu_slugify(mtag)
		const elt = model.elements[slug]
		if(!elt)
			console.log("Zoiks, not found:'"+mtag+"'")
		else
			writeElement(elt,ctx)
	}
}

export = (args:string[]) => {

	console.log("start, args=",args);
	const matchlist : string =fs.readFileSync('wglist.txt')
	analyze('elements.json','connections.json','output',(matchlist+'').split("\n")).then(()=>{
		console.log("done");
	})
}
