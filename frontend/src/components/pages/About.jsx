import React, {useEffect} from 'react'


function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);

  return (
    
    <div>
        <div className='black-strip'></div>
        <section className="page-section" id="about">
            <div className="container">
                <div className="text-center">
                    <h2 className="section-heading text-uppercase mb-5">About</h2>
                </div>
                <ul className="timeline">
                    <li>
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/assets/img/happy-black-teacher-teaching-elementary-students-math-classroom.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>2009-2011</h4>
                                <h4 className="subheading">Our Humble Beginnings</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">AWARE was born from the personal experience of a dedicated teacher and mother, who recognized the profound need for greater awareness and acceptance of neurodiversity. As a former teacher with a neurodivergent child, she saw firsthand the challenges that students, parents, and educators faced in understanding and supporting brain differences. What started as informal workshops in local schools quickly grew into a grassroots movement to foster inclusion, acceptance, and understanding in the community.</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/assets/img/kids-raising-hands.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>March 2011</h4>
                                <h4 className="subheading">AWARE is Born</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">In early 2011, the vision of Advancing Wellbeing and Acceptance Through Resources and Education (AWARE) took formal shape. With the help of passionate volunteers and educators, AWARE began offering resources to teachers, parents, and students, helping them understand neurodiversity and build more inclusive classrooms. The mission was clear: equip educators and students with the knowledge and tools to support neurodivergent individuals, creating a more understanding and accepting world.</p></div>
                        </div>
                    </li>
                    <li>
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="/assets/img/medium-shot-smiley-kids-sitting-bench.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>December 2015</h4>
                                <h4 className="subheading">Growth and Recognition</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">By 2015, AWARE had become a beacon of support for schools and communities across the country. What started as small workshops had expanded into national programs, providing free educational kits, lesson plans, and guest speakers to schools. Teachers and administrators recognized the impact of AWARE’s resources, and many shared stories of how their classrooms had transformed into safe, inclusive environments where every child could thrive. AWARE’s work was beginning to reach hearts far and wide, as it touched the lives of both neurodivergent individuals and their peers.</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image"><img className="rounded-circle img-fluid" src="assets/img/graph-growth-development-improvement-profit-success-concept.jpg" alt="..." /></div>
                        <div className="timeline-panel">
                            <div className="timeline-heading">
                                <h4>July 2020</h4>
                                <h4 className="subheading">The Growth Continues</h4>
                            </div>
                            <div className="timeline-body"><p className="text-muted">In the midst of a changing world, AWARE launched its Phase Two Expansion, doubling down on its commitment to advancing acceptance and understanding. New virtual programs and online resources made it easier for schools and communities to access materials no matter where they were. AWARE also introduced nationwide speaking events, connecting neurodiverse advocates with educators to share real stories and foster deeper empathy. This expansion was a crucial step in building a more connected, compassionate community for neurodivergent people everywhere.</p></div>
                        </div>
                    </li>
                    <li className="timeline-inverted">
                        <div className="timeline-image">
                            <h4>
                                Be Part
                                <br />
                                Of Our
                                <br />
                                Story!
                            </h4>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="d-flex justify-content-center text-center m-5">
            <div className="col-md-6"><p>AWARE’s journey continues, and we invite you to be part of it. Together, we can build a world that embraces every brain and nurtures the potential in every child. Join us in our mission to foster acceptance, understanding, and inclusion for all!</p></div>
            </div>
        </section>

    </div>
  )
}
export default About;