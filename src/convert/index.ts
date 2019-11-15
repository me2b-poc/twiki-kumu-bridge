import fs from 'fs-extra'
import { kumuloader } from '../kumu'
import { tiddlyloader } from '../tiddly'
//import { TiddlerFileBase } from './tiddly'
import { schemas } from '../schema'
import slugify from 'slugify'

import { KumuModel,KumuElement } from '../kumu'
import { TiddlerFileBase,NodeTiddler } from '../tiddly'

import { KumuConnectionType,KumuElementType } from '../kumu'
import { EdgeTypeTiddler,NodeTypeTiddler } from '../tiddly'

import { TiddlyMap,SimpleTiddlyMap,TiddlerViewFiles } from '../tiddly'

import { Context } from '../context'


import { createNodeTiddlerFromElement } from './create-node-tiddler'

function createEdgeTypeTiddlerFromConnectionType(type:KumuConnectionType,ctx:Context):EdgeTypeTiddler
{
	const result = ctx.tiddly.createEdgeTypeTiddler(type.parts)
	return result
}

function createNodeTypeTiddlerFromElementType(type:KumuElementType,ctx:Context):NodeTypeTiddler
{
	const result = ctx.tiddly.createNodeTypeTiddler(type.parts)
	return result
}

async function writeMap(map:TiddlyMap,ctx:Context) {
	const files = new TiddlerViewFiles(map,ctx.tiddly)

	console.log("Writing View Tiddler:",files.tiddler)
	await fs.writeFile(files.tiddler,files.tiddlerdata())

	console.log("Writing View Tiddler:",files.edges)
	await fs.writeFile(files.edges,files.edgedata())

	console.log("Writing View Tiddler:",files.nodes)
	await fs.writeFile(files.nodes,files.nodedata())

	console.log("Writing View Tiddler:",files.layout)
	await fs.writeFile(files.layout,files.layoutdata())

}

async function convert(eltfile:string,connfile:string,filebase:string) {

	console.log("Load Kumu");
	const model = await kumuloader(eltfile,connfile)

	console.log("Load Tiddly");
	const tiddly = await tiddlyloader(filebase)

	const ctx:Context = { model,tiddly,schemas }

	const map = new SimpleTiddlyMap("Everything")
	const map2 = new SimpleTiddlyMap("Nothing")
	const map3 = new SimpleTiddlyMap("Something")

	const mapmap = new Map<string,SimpleTiddlyMap>()

	console.log("Convert Kumu Elements -> Tiddlers");
	const nodes:NodeTiddler[] = []
	for(let slug in model.elements) {
		const tiddler = createNodeTiddlerFromElement(model.elements[slug],ctx)
		nodes.push(tiddler)
		map.nodes.add(tiddler.tmap_id)
		if(tiddler.tmap_id[4]=='3')
			map3.nodes.add(tiddler.tmap_id)

		const elt = model.elements[slug]
		const tname = elt.type.name
		if(!mapmap[tname])
			mapmap[tname] = new SimpleTiddlyMap(tname)
		mapmap[tname].nodes.add(tiddler.tmap_id)
	}

	return

	console.log("Convert Kumu Connection Types -> Edge Type Tiddlers");
	const edgeTypes:EdgeTypeTiddler[] = []
	for(let slug in model.connectionTypes) {
		const tiddler = createEdgeTypeTiddlerFromConnectionType(model.connectionTypes[slug],ctx)
		edgeTypes.push(tiddler)
	}

	console.log("Convert Kumu Element Types -> Node Type Tiddlers");
	const nodeTypes:NodeTypeTiddler[] = []
	for(let slug in model.elementTypes) {
		const tiddler = createNodeTypeTiddlerFromElementType(model.elementTypes[slug],ctx)
		nodeTypes.push(tiddler)
	}

	console.log("Writing Tiddlers");
	for(let node of nodes) {
		const dir = node.tiddlerdir()
		const path = node.tiddlerfile()
		const data = node.tiddlerdata()
		await tiddly.ensurePath(dir)
		console.log("Writing Tiddler:",path)
		await fs.writeFile(path,data)
	}

	console.log("Writing Edge Types");
	for(let type of edgeTypes) {
		const dir = type.tiddlerdir()
		const path = type.tiddlerfile()
		const data = type.tiddlerdata()
		await tiddly.ensurePath(dir)
		console.log("Writing Edge Type:",path)
		await fs.writeFile(path,data)
	}

	console.log("Writing Node Types");
	for(let type of nodeTypes) {
		const dir = type.tiddlerdir()
		const path = type.tiddlerfile()
		const data = type.tiddlerdata()
		await tiddly.ensurePath(dir)
		console.log("Writing Node Type:",path)
		await fs.writeFile(path,data)
	}

	await writeMap(map,ctx)
	await writeMap(map2,ctx)
	await writeMap(map3,ctx)
	for(let x in mapmap)
		await writeMap(mapmap[x],ctx)
}

export = (args:string[]) => {

	console.log("start, args=",args);
	convert('elements.json','connections.json','output').then(()=>{
		console.log("done");
	})
}
