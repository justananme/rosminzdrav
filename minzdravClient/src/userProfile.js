import React from 'react';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        const usernameStyle = this.props.premium ? { display: 'none' } : { visibility: 'hidden' };

        return (
            <div className='wrapper'>
                <div className='profile2'>
                    <div className='profile2ScoreWrapper'>
                        <div className='profile2ScoreContent'>
                            <div className='profileCellValue'>{this.props.zets}</div>
                            <div className='profileCellCaption'>Баллы</div>
                        </div>
                    </div>
                    <div className='profile2BalanceWrapper' style={{ display: this.props.premium ? 'none' : 'inherit' }}>
                        <div className='profile2BalanceContent'>
                            <div className='profileCellValue'>{this.props.queriesLeft}</div>
                            <div className='profileCellCaption'><span>Баланс</span></div>
                        </div>
                    </div>
                    <div className='profileName'>
                        <div className='profileNameContent'>
                            <div className='profileCellValue' style={usernameStyle}>0</div>
                            <div className='profileCellCaption'>
                                <div className='profileCellCaptionName'>
                                    <div className='premiumTip' style={{ display: this.props.premium ? 'block' : 'none' }}>PREMIUM</div>
                                    <div style={{ display: this.props.premium ? 'block' : 'none', height: '4px' }}></div>
                                    <div>{this.props.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)
    }
}

export default Profile;