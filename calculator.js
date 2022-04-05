window.addEventListener("load", load, false);

const CONTAINER_TABLE = document.getElementById("tableContainer")

function load() {

	const NUMBER_MANA_COST = setupInputElement(document.getElementById("manaCost"), display)

	let manaCost = 4;

	display()

	function display() {

		manaCost = getManaCostFromInput()

		let breakpoints = new Array()
		let frame = 100
		let lastRegenSec = 0

		let headers = ["Frame Length", "Mana Needed", "Needed for Next"];

		for (let mana = 2; mana <= manaCost * 1500; mana += 2) {
			let manaCostSec = 25 / frame * manaCost
			let regenSec = Math.floor(256 * mana / 3000) / 256 * 25
			if (regenSec >= manaCostSec) {
				if (regenSec != lastRegenSec) {
					if (breakpoints.length > 0) {
						let lastBp = breakpoints[breakpoints.length - 1]
						lastBp[2] = mana - lastBp[1]
					}
					breakpoints.push([frame, mana, 0])
					lastRegenSec = regenSec
				}
				frame--
			}
		}

		let i = 0
		while (i < breakpoints.length) {
			if (i != breakpoints.length - 1 && Math.abs(breakpoints[i][0] - breakpoints[i + 1][0]) > 1) {
				breakpoints.splice(0, i + 1)
				i = 0
			} else i++
		}

		breakpoints[breakpoints.length - 1][2] = "-"

		breakpoints.reverse()
		displayTable(headers, breakpoints)

	}

	function getManaCostFromInput() {
		let value = NUMBER_MANA_COST.value
		value = Math.max(1, value)
		if (value != NUMBER_MANA_COST.value) NUMBER_MANA_COST.value = value
		return value
	}

}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild)
	}
}

function displayTable(headers, breakpoints) {

	removeAllChildNodes(CONTAINER_TABLE)

	let table = document.createElement("table")

	addTableHeader(table, headers)

	for (const breakpoint of breakpoints) {
		addTableRow(table, breakpoint)
	}

	CONTAINER_TABLE.appendChild(table)
}

function addTableHeader(table, headers) {

	let tableRow = document.createElement("tr")

	for (const header of headers) {
		let th = document.createElement("th")
		th.innerHTML = header
		tableRow.appendChild(th)
	}

	table.appendChild(tableRow)
}

function addTableRow(table, values) {

	let tableRow = document.createElement("tr")

	for (const value of values) {
		let td = document.createElement("td")
		td.innerHTML = value
		tableRow.appendChild(td)
	}

	table.appendChild(tableRow)
}

function setupInputElement(element, eventListener) {
	element.addEventListener("change", eventListener, false)
	if (element.type == "number") {
		element.onkeydown = function (e) { // only allows the input of numbers, no negative signs
			if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
				return false
			}
		}
	}
	return element
}
