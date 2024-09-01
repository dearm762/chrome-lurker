const form = document.getElementsByTagName('form')[0]

if (form) {
	const formChildrenArray = Array.from(form.children)
	formChildrenArray.forEach(child => {
		if (child.tagName.toLowerCase() === 'button') {
			child.addEventListener('click', () => {
				formChildrenArray.forEach(element => {
					if (element.tagName.toLowerCase() === 'input') {
                        console.log(element.type)
                    }
				})
			})
		}
	})
}
