import styled, { createGlobalStyle } from "styled-components";
import { designTokens } from "@/app/design/tokens";

const { colors, layout, typography, borders, effects } = designTokens;

export const FieldWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${layout.space.xxxSmall};
	width: 100%;
	min-width: 0;

	.select__container {
		width: 100%;
		max-width: 100%;
		min-width: 0;
	}

	.select__control {
		width: 100%;
		max-width: 100%;
		min-width: 0;
		height: 52px;
		min-height: 52px;
		max-height: 52px;
		box-sizing: border-box;
    border-radius: ${borders.radius.medium};
    padding-top: ${layout.space.small};
    padding-bottom: ${layout.space.small};
    padding-right: ${layout.space.small};
		padding-left: ${layout.space.medium};
		gap: ${layout.space.xSmall};
		color: ${colors.text.text1};
		background: ${colors.base.translucent10};
		overflow: hidden;

		&:hover {
			background: ${colors.base.translucent20};
		}

		&:active {
			box-shadow: inset 0 0 0 2px ${colors.text.text1};
			background: transparent;
			outline: none;
		}
	}

	.select__control.select__control--is-focused {
		background: transparent;
		outline: 2px solid ${colors.utility.focus} !important;
		outline-offset: 2px;
		box-shadow: inset 0 0 0 2px ${colors.text.text1};
	}

	.select__control.select__control--is-focused:hover {
		background: transparent;
	}

	.select__control.select__control--has-error {
		box-shadow: inset 0 0 0 2px ${colors.alert.alertA};
	}

	.select__control--is-focused.select__control--has-error {
		box-shadow: inset 0 0 0 2px ${colors.alert.alertA};
	}

	.select__value-container {
		display: flex;
		flex: 1 1 auto;
		height: 100%;
		min-width: 0;
		min-height: 0;
		flex-wrap: nowrap;
		gap: ${layout.space.xxSmall};
		padding: 0;
		overflow-x: auto;
		overflow-y: hidden;
		white-space: nowrap;
	}

	.select__placeholder {
		${typography.body.mediumRegular};
		color: ${colors.text.text2};
		margin: 0;
	}

	.select__multi-value {
		margin: 0;
		flex-shrink: 0;
		background: ${colors.base.translucent10};
		border-radius: ${borders.radius.round};
		padding: ${layout.space.xxSmall} ${layout.space.xSmall};
		display: inline-flex;
		align-items: center;
		gap: ${layout.space.xxxSmall};
	}

	.select__multi-value__label {
		${typography.body.smallBold};
		color: ${colors.text.text1};
		padding: 0;
	}

	.select__multi-value__remove {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: ${borders.radius.round};
		color: ${colors.text.text1};
		padding: 0;

		&:hover {
			background: ${colors.base.translucent20};
			color: ${colors.text.text1};
		}
	}

	.select__input-container {
		order: 0;
		margin: 0;
		padding: 0;
		width: 2px;
		min-width: 2px;
		flex: 0 0 auto;
	}
`;

// Portaled menu styles must be global when menuPortalTarget is document.body.
export const MultiInputMenuGlobalStyles = createGlobalStyle`
	.select__menu {
		background: ${colors.base.base3};
		border: ${borders.width.thin} solid ${colors.base.translucent10};
		border-radius: ${borders.radius.xxLarge};
		overflow: hidden;
		z-index: 9999;
		margin-top: 4px;
		${effects.boxShadow.elevationModal};
	}

	.select__menu-list {
		display: flex;
		flex-direction: column;
		gap: ${layout.space.xxxSmall};
		padding: ${layout.space.xSmall};
	}

	.select__option {
		padding: 0;
		background: transparent;
	}
`;

export const Label = styled.label`
	${typography.body.smallBold};
	color: ${colors.text.text2};
`;

export const HelperText = styled.span`
	${typography.body.smallRegular};
	color: ${colors.text.text2};
`;

export const ErrorText = styled.span`
	${typography.body.smallBold}
	color: ${colors.alert.alertA};
	display: flex;
	gap: ${layout.space.xxxSmall};
`;

export const OptionContent = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

export const OptionLabel = styled.span`
	${typography.body.mediumRegular};
	color: ${colors.text.text1};
`;

export const OptionRow = styled.div<{ $isFocused?: boolean; $isSelected?: boolean }>`
	display: flex;
	width: 100%;
	box-sizing: border-box;
	padding: ${layout.space.small} ${layout.space.small} ${layout.space.small} ${layout.space.medium};
	border-radius: ${borders.radius.large};
	background: ${({ $isFocused }) => ($isFocused ? colors.base.translucent10 : "transparent")};
	cursor: pointer;
	color: ${colors.text.text1};

	&:hover {
		background: ${colors.base.translucent10};
	}
`;
