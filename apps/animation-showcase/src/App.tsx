import React from 'react';
import './App.css';
import ButtonRequirement from './components/ButtonRequirement';
import AnimatedButton from './components/AnimatedButton';
import PlaneIcon from './components/icons/PlaneIcon';
import CheckIcon from './components/icons/CheckIcon';

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Button Animation Challenge</h1>
      </header>

      <main className="app-content">
        <section className="challenge-description">
          <h2>Challenge Requirements</h2>
          <p>
            Create a reusable button component that replicates the animation
            shown in the example.
          </p>
        </section>

        <section className="examples-section">
          <h2>Create this button</h2>
          <ButtonRequirement />
        </section>

        <section className="your-solution">
          <h2>Your Solution</h2>
          <p>Implement your animated button component and showcase it below:</p>
          <p>
            I have implimented a very complete solution for this challenge. I
            have built out a way to define a timeline of animation events. This
            allows for a lot of flexibility in the animation of the button. Also
            there is a robust theming and variant system.
          </p>
          <p>
            I will note that the icons are optional and can be omitted, however
            the design of the button does not really make sense without an icon.
            There are a lot of edge cases to be considered when icons are
            omitted that would more appropriately be handled by a different
            component. Additionally I should note I have not made mouse a
            pointer on the button as technically that is not an accessibility
            requirement but has simply become an expectation, it can be easily
            added.
          </p>
          <p>AI did help create a nice demo of the button :)</p>
          <div className="solution-demo">
            <AnimatedButton
              completedText="Flight booked"
              animated
              size="large"
              icon={<PlaneIcon />}
              completedIcon={<CheckIcon />}
            >
              Book your flight
            </AnimatedButton>
          </div>
        </section>

        <section className="demo-showcase">
          <h2>Button Demo Showcase</h2>
          <p>
            Explore all the different sizes and themes available for the
            animated button:
          </p>

          <div className="demo-controls">
            <p className="demo-instructions">
              Click any button below to see the animation in action.
            </p>
          </div>

          <div className="demo-section">
            <h3>Size Variants</h3>
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Small</h4>
                <AnimatedButton
                  completedText="Task completed"
                  animated
                  size="small"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Small button
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Medium</h4>
                <AnimatedButton
                  completedText="Task completed"
                  animated
                  size="medium"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Medium button
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Large</h4>
                <AnimatedButton
                  completedText="Task completed"
                  animated
                  size="large"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Large button
                </AnimatedButton>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <h3>Color Themes</h3>
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Primary Theme</h4>
                <AnimatedButton
                  completedText="Primary completed"
                  animated
                  color="primary"
                  size="medium"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Primary button
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Secondary Theme</h4>
                <AnimatedButton
                  completedText="Secondary completed"
                  animated
                  color="secondary"
                  size="medium"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Secondary button
                </AnimatedButton>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <h3>Size & Theme Combinations</h3>
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Small Primary</h4>
                <AnimatedButton
                  completedText="Done"
                  animated
                  color="primary"
                  size="small"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Small primary
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Small Secondary</h4>
                <AnimatedButton
                  completedText="Done"
                  animated
                  color="secondary"
                  size="small"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Small secondary
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Medium Primary</h4>
                <AnimatedButton
                  completedText="Completed"
                  animated
                  color="primary"
                  size="medium"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Medium primary
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Medium Secondary</h4>
                <AnimatedButton
                  completedText="Completed"
                  animated
                  color="secondary"
                  size="medium"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Medium secondary
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Large Primary</h4>
                <AnimatedButton
                  completedText="Successfully completed"
                  animated
                  color="primary"
                  size="large"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Large primary
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Large Secondary</h4>
                <AnimatedButton
                  completedText="Successfully completed"
                  animated
                  color="secondary"
                  size="large"
                  icon={<PlaneIcon />}
                  completedIcon={<CheckIcon />}
                >
                  Large secondary
                </AnimatedButton>
              </div>
            </div>
          </div>

          <div className="demo-section">
            <h3>Without Icons (Edge Cases)</h3>
            <p className="demo-note">
              Note: While the button works without icons, the animation design
              is optimized for use with icons.
            </p>
            <div className="demo-grid">
              <div className="demo-item">
                <h4>Text Only - Primary</h4>
                <AnimatedButton
                  completedText="Text completed"
                  animated
                  color="primary"
                  size="medium"
                >
                  Text only
                </AnimatedButton>
              </div>

              <div className="demo-item">
                <h4>Text Only - Secondary</h4>
                <AnimatedButton
                  completedText="Text completed"
                  animated
                  color="secondary"
                  size="medium"
                >
                  Text only
                </AnimatedButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Button Animation Challenge &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
