class DraggableSlider {
  /**
   *
   * @param {String} sliderID the ID to query on the page
   * @param {String} innerClass the className of the slider inner
   * @param {String} slideClass the className of the slider slides
   * @returns
   */
  constructor(sliderID, innerClass = 'inner', slideClass = 'slide') {
    // Grab the elements
    this.elem = document.getElementById(sliderID)
    if (this.elem == null) return DraggableSlider.InvalidSliderStructure(sliderID)

    this.inner = this.elem.querySelector(`.${innerClass}`)
    if (this.inner == null) return DraggableSlider.InvalidSliderStructure(sliderID)

    this.slides = this.inner.querySelectorAll(`.${slideClass}`)
    if (!this.slides.length) return DraggableSlider.InvalidSliderStructure(sliderID)

    // Initialize properties
    this.activeSlide = null
    this.startSlide = null
    this.startX = null

    // Add event listeners
    this.elem.addEventListener('mousedown', e => {
      this.onStart(e)
    })
    this.elem.addEventListener('touchstart', e => {
      this.onStart(e)
    })
    this.elem.addEventListener('mouseleave', () => {
      this.onEnd()
    })
    this.elem.addEventListener('mouseup', () => {
      this.onEnd()
    })
    this.elem.addEventListener('touchend', () => {
      this.onEnd()
    })
    this.elem.addEventListener('mousemove', e => {
      this.onMove(e)
    })
    this.elem.addEventListener('touchmove', e => {
      this.onMove(e)
    })
    window.addEventListener('resize', () => {
      this.moveToActiveSlide()
    })

    // Set the active slide and classes
    this.setActiveSlide(this.getActiveSlide())
  }

  /**
   * Logs a warning for an invalid slider structure (empty or missing elements)
   *
   * @param {String} sliderID
   */
  static InvalidSliderStructure = sliderID => {
    console.warn(`The DraggableSlider with ID ${sliderID} will not work as it has some missing elements.`)
  }

  /**
   * Get the index of the slide which is closest to the center of the slider
   *
   * @returns {Number} the index of the slide
   */
  getActiveSlide = () => {
    let res = 0
    for (let i = 1; i < this.slides.length; i++) if (Math.abs(this.getSlideOffset(i)) < Math.abs(this.getSlideOffset(i - 1))) res = i
    return res
  }

  /**
   * Get the absolute horizontal offset of a slide from the slider's center point
   *
   * @param {Number} slide the index of the slide
   * @returns {Number} the absolute of the offset in pixels
   */
  getSlideOffset = slide => {
    let sliderRect = this.elem.getBoundingClientRect()
    let slideRect = this.slides[slide].getBoundingClientRect()
    return slideRect.left + slideRect.width / 2 - (sliderRect.left + sliderRect.width / 2)
  }

  /**
   * Get the left CSS property value of the slider's inner
   * @returns {Number}
   */
  getInnerLeft = () => {
    let res = parseInt(this.inner.style.left)
    if (isNaN(res) || res == null) return 0
    return res
  }

  /**
   * Initialize the active state of the slider
   *
   * @param {Event} e
   */
  onStart = e => {
    this.elem.classList.add('active')
    this.startX = e.pageX || e.touches[0].pageX
    this.startSlide = this.activeSlide
  }

  /**
   * Remove the active state of the slider
   */
  onEnd = () => {
    this.elem.classList.remove('active')
    if (this.startSlide != this.activeSlide || this.activeSlide == 0 || this.activeSlide == this.slides.length - 1) this.moveToActiveSlide()
  }

  /**
   * Get the touch / mouse move distance and move the slider inner
   *
   * @param {Event} e
   */
  onMove = e => {
    if (!this.elem.classList.contains('active')) return
    e.preventDefault()
    let pos = e.pageX || e.touches[0].pageX
    let dist = pos - this.startX
    this.startX = pos
    this.inner.style.left = this.getInnerLeft() + dist + 'px'
    this.setActiveSlide(this.getActiveSlide())
  }

  /**
   * Move the slider to the active slide
   */
  moveToActiveSlide = () => {
    if (this.activeSlide == null) this.activeSlide = 0
    this.moveToSlide(this.activeSlide)
  }

  /**
   * Move the slider to a specified slide, to the last one if the number is greater than the
   * amount of slides or to the first one if the number is inferior to zero.
   *
   * @param {Number} slide the index of the slide
   */
  moveToSlide = slide => {
    // Edge cases
    if (slide < 0) slide = 0
    if (slide > this.slides.length - 1) slide = this.slides.length - 1

    // Update active slide and active classes
    this.setActiveSlide(slide)

    // Move the slider
    this.inner.style.left = this.getInnerLeft() - this.getSlideOffset(this.activeSlide) + 'px'
  }

  /**
   * Set a slide as active and update the active class
   *
   * @param {Number} slide the slide to set as active
   */
  setActiveSlide = slide => {
    // Edge cases
    if (slide < 0) slide = 0
    if (slide > this.slides.length - 1) slide = this.slides.length - 1

    this.activeSlide = slide
    for (let i = 0; i < this.slides.length; i++) {
      if (i == this.activeSlide) this.slides[i].classList.add('active')
      else this.slides[i].classList.remove('active')
    }
  }
}
